// SPDX-License-Identifier: MIT
pragma solidity >=0.8.28;

import {IERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IStakedUSDf {

    // Structs
    struct UserCooldown {
        uint104 cooldownEnd;
        uint152 underlyingAmount;
    }

    // Errors
    error RewardsStillVesting();
    error CooldownNotEnded();
    error DurationExceedsMax();
    error ZeroAmount();
    error ZeroAddress();
    error MinSharesViolation();
    error ExpectedCooldownOn();
    error ExpectedCooldownOff();
    error StatusNotChanged();
    error DurationNotChanged();
    error AddressRestricted(address account);
    error AddressNotRestricted(address account);

    // Events
    event RewardsReceived(uint256 amount);
    event CooldownDurationUpdated(uint24 previousDuration, uint24 newDuration);
    event VestingPeriodUpdated(uint32 previousPeriod, uint32 newPeriod);
    event LockedAmountRedistributed(address indexed from, bool sharesBurned, uint256 amount);
    event RestrictedStatusSet(address indexed account, bool status);

    /**
     * @notice Returns the rewards amount that has not been vested yet
     */
    function getUnvestedAmount() external view returns (uint256);

    /**
     * @notice Transfers rewards and updates the vesting amount
     * @dev Allowed only by rewarder role
     * @param amount The amount of reward tokens to transfer
     */
    function transferInRewards(uint256 amount) external;

    /**
     * @notice Withdraws assets with a cooldown period
     * @param assets The amount of assets to withdraw
     * @param owner The address of the owner of the assets
     */
    function cooldownAssets(uint256 assets, address owner) external returns (uint256 shares);

    /**
     * @notice Redeems shares with a cooldown period
     * @param shares The amount of shares to redeem
     * @param owner The address of the owner of the shares
     */
    function cooldownShares(uint256 shares, address owner) external returns (uint256 assets);

    /**
     * @notice Unstakes assets after cooldown period ends
     * @param receiver The address to receive the assets
     */
    function unstake(address receiver) external;

    /**
     * @notice Sets the cooldown duration for withdrawals
     * @dev Allowed only by admin role
     * @param duration The duration of the cooldown period
     */
    function setCooldownDuration(uint24 duration) external;

    /**
     * @notice Sets restriction status of an address
     * @dev Allowed only by admin role
     * @param account The address to add/remove restriction
     * @param status Status of the restriction
     */
    function setRestrictedStatus(address account, bool status) external;

    /**
     * @notice Sets the vesting period for rewards
     * @dev Allowed only by admin role
     * @param period The new duration of the vesting period
     */
    function setVestingPeriod(uint32 period) external;

    /**
     * @notice Redistributes locked amount in case an address was restricted
     * @dev Allowed only by admin role
     * @param from The restricted address to redistribute the shares from
     * @param burnShares Whether to burn the shares or transfer to treasury
     */
    function redistributeLockedAmount(address from, bool burnShares) external;

}
