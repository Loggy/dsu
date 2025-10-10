// SPDX-License-Identifier: MIT
pragma solidity >=0.8.28;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {ERC20Upgradeable, IERC20Metadata} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20PermitUpgradeable} from
    "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {ERC4626Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import {IERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {USDfSilo} from "./USDfSilo.sol";
import {IStakedUSDf} from "./interfaces/IStakedUSDf.sol";

contract StakedUSDf is IStakedUSDf, AccessControlUpgradeable, ERC20PermitUpgradeable, ERC4626Upgradeable {

    using SafeERC20 for IERC20;

    /* ------------- CONSTANTS ------------- */
    bytes32 public constant REWARDER_ROLE = keccak256("REWARDER_ROLE");
    uint32 public constant MAX_VESTING_PERIOD = 7 days;
    uint256 public constant MIN_SHARES = 1e18;
    uint24 public constant MAX_COOLDOWN_DURATION = 90 days;
    address public immutable TREASURY;

    /* ------------- STATE VARIABLES ------------- */
    uint256 public vestingAmount;
    uint40 public lastDistributionTimestamp;
    uint32 public vestingPeriod;
    uint24 public cooldownDuration;
    USDfSilo public silo;

    mapping(address => UserCooldown) public cooldowns;
    mapping(address => bool) public isRestricted;

    modifier ensureCooldownOff() {
        _checkCooldownOff();
        _;
    }

    modifier ensureCooldownOn() {
        _checkCooldownOn();
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(address treasury) {
        _checkZeroAddress(treasury);
        TREASURY = treasury;
        _disableInitializers();
    }

    /* ------------- EXTERNAL FUNCTIONS ------------- */

    function initialize(
        IERC20 usdf,
        address admin,
        USDfSilo silo_,
        uint32 initialVesting,
        uint24 initialCooldown
    )
        external
        initializer
    {
        __AccessControl_init();
        __ERC20_init("Staked Falcon USD", "sUSDf");
        __ERC20Permit_init("Staked Falcon USD");
        __ERC4626_init(usdf);

        _checkZeroAddress(admin);
        _checkZeroAddress(address(usdf));

        _setVestingPeriod(initialVesting);
        _setCooldownDuration(initialCooldown);

        _grantRole(DEFAULT_ADMIN_ROLE, admin);

        silo = silo_;
        silo_.setStakingVault();
    }

    /// @inheritdoc IStakedUSDf
    function setRestrictedStatus(address account, bool status) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _checkZeroAddress(account);
        require(isRestricted[account] != status, StatusNotChanged());

        isRestricted[account] = status;
        emit RestrictedStatusSet(account, status);
    }

    /// @inheritdoc IStakedUSDf
    function redistributeLockedAmount(address from, bool burnShares) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // Redistribute only when `from` is restricted
        require(isRestricted[from], AddressNotRestricted(from));

        uint256 amountToDistribute = balanceOf(from);
        _checkZeroAmount(amountToDistribute);

        if (burnShares) {
            uint256 usdfToVest = previewRedeem(amountToDistribute);
            _burn(from, amountToDistribute);
            _updateVestingAmount(usdfToVest);
        } else {
            _transfer(from, TREASURY, amountToDistribute);
        }

        emit LockedAmountRedistributed(from, burnShares, amountToDistribute);
    }

    /* ------------- EXTERNAL FUNCTIONS ------------- */
    /// @inheritdoc IStakedUSDf
    function transferInRewards(uint256 amount) external onlyRole(REWARDER_ROLE) {
        require(totalSupply() > 0, MinSharesViolation());

        _updateVestingAmount(amount);
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);
        emit RewardsReceived(amount);
    }

    /// @inheritdoc ERC4626Upgradeable
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    )
        public
        override
        ensureCooldownOff
        returns (uint256)
    {
        return super.withdraw(assets, receiver, owner);
    }

    /// @inheritdoc ERC4626Upgradeable
    function redeem(
        uint256 shares,
        address receiver,
        address owner
    )
        public
        override
        ensureCooldownOff
        returns (uint256)
    {
        return super.redeem(shares, receiver, owner);
    }

    /// @inheritdoc IStakedUSDf
    function cooldownAssets(uint256 assets, address owner) external ensureCooldownOn returns (uint256 shares) {
        cooldowns[owner].cooldownEnd = uint104(block.timestamp) + cooldownDuration;
        cooldowns[owner].underlyingAmount += uint152(assets);

        shares = super.withdraw(assets, address(silo), owner);
    }

    /// @inheritdoc IStakedUSDf
    function cooldownShares(uint256 shares, address owner) external ensureCooldownOn returns (uint256 assets) {
        assets = super.redeem(shares, address(silo), owner);

        cooldowns[owner].cooldownEnd = uint104(block.timestamp) + cooldownDuration;
        cooldowns[owner].underlyingAmount += uint152(assets);
    }

    /// @inheritdoc IStakedUSDf
    function unstake(address receiver) external {
        _checkZeroAddress(receiver);

        UserCooldown storage userCooldown = cooldowns[msg.sender];
        uint256 assets = userCooldown.underlyingAmount;

        require(block.timestamp >= userCooldown.cooldownEnd, CooldownNotEnded());

        userCooldown.cooldownEnd = 0;
        userCooldown.underlyingAmount = 0;

        silo.withdraw(receiver, assets);
    }

    /// @inheritdoc IStakedUSDf
    function setCooldownDuration(uint24 newDuration) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setCooldownDuration(newDuration);
    }

    /// @inheritdoc IStakedUSDf
    function setVestingPeriod(uint32 newPeriod) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setVestingPeriod(newPeriod);
    }

    /* ------------- PUBLIC FUNCTIONS ------------- */
    function totalAssets() public view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this)) - getUnvestedAmount();
    }

    /// @inheritdoc IStakedUSDf
    function getUnvestedAmount() public view returns (uint256) {
        uint256 timeSinceLastDistribution = uint40(block.timestamp) - lastDistributionTimestamp;
        if (timeSinceLastDistribution >= vestingPeriod) {
            return 0;
        }
        uint256 deltaT;
        unchecked {
            deltaT = (vestingPeriod - timeSinceLastDistribution);
        }
        return (deltaT * vestingAmount) / vestingPeriod;
    }

    function decimals() public pure override(ERC4626Upgradeable, ERC20Upgradeable) returns (uint8) {
        return 18;
    }

    /* ------------- INTERNAL FUNCTIONS ------------- */
    function _updateVestingAmount(uint256 newVestingAmount) internal {
        _checkZeroAmount(newVestingAmount);
        require(getUnvestedAmount() == 0, RewardsStillVesting());
        vestingAmount = newVestingAmount;
        lastDistributionTimestamp = uint40(block.timestamp);
    }

    function _checkMinShares() internal view {
        uint256 supply = totalSupply();
        if (supply > 0 && supply < MIN_SHARES) {
            revert MinSharesViolation();
        }
    }

    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal override {
        _checkZeroAmount(assets);
        _checkZeroAmount(shares);
        _checkRestricted(caller);
        _checkRestricted(receiver);

        super._deposit(caller, receiver, assets, shares);
        _checkMinShares();
    }

    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    )
        internal
        override
    {
        _checkZeroAmount(assets);
        _checkZeroAmount(shares);
        _checkRestricted(caller);
        _checkRestricted(receiver);
        _checkRestricted(owner);

        super._withdraw(caller, receiver, owner, assets, shares);
        _checkMinShares();
    }

    function _setVestingPeriod(uint32 newPeriod) internal {
        uint32 oldVestingPeriod = vestingPeriod;
        require(newPeriod <= MAX_VESTING_PERIOD, DurationExceedsMax());
        require(oldVestingPeriod != newPeriod, DurationNotChanged());
        require(newPeriod > 0 || cooldownDuration > 0, ExpectedCooldownOn()); // if period is 0, cooldown must be on

        vestingPeriod = newPeriod;
        emit VestingPeriodUpdated(oldVestingPeriod, newPeriod);
    }

    function _setCooldownDuration(uint24 newDuration) internal {
        uint24 previousDuration = cooldownDuration;
        require(previousDuration != newDuration, DurationNotChanged());
        require(newDuration <= MAX_COOLDOWN_DURATION, DurationExceedsMax());

        cooldownDuration = newDuration;
        emit CooldownDurationUpdated(previousDuration, newDuration);
    }

    /* ------------- Checkers to reduce code size ------------- */
    function _checkZeroAddress(address account) internal pure {
        require(account != address(0), ZeroAddress());
    }

    function _checkZeroAmount(uint256 amount) internal pure {
        require(amount > 0, ZeroAmount());
    }

    function _checkRestricted(address account) internal view {
        require(!isRestricted[account], AddressRestricted(account));
    }

    function _checkCooldownOn() internal view {
        require(cooldownDuration > 0, ExpectedCooldownOn());
    }

    function _checkCooldownOff() internal view {
        require(cooldownDuration == 0, ExpectedCooldownOff());
    }

}
