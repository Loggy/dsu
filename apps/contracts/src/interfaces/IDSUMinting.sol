// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

/* solhint-disable var-name-mixedcase  */

interface IDSUMinting {
    enum Role {
        Minter,
        Redeemer
    }

    enum OrderType {
        MINT,
        REDEEM
    }

    enum TokenType {
        STABLE,
        ASSET
    }

    enum SignatureType {
        EIP712,
        EIP1271
    }

    enum DelegatedSignerStatus {
        REJECTED,
        PENDING,
        ACCEPTED
    }

    struct Signature {
        SignatureType signature_type;
        bytes signature_bytes;
    }

    struct Route {
        address[] addresses;
        uint128[] ratios;
    }

    struct Order {
        string order_id;
        OrderType order_type;
        uint120 expiry;
        uint128 nonce;
        address benefactor;
        address beneficiary;
        address collateral_asset;
        uint128 collateral_amount;
        uint128 dsu_amount;
    }

    struct TokenConfig {
        /// @notice tracks asset type (STABLE or ASSET)
        TokenType tokenType;
        /// @notice tracks if the asset is active
        bool isActive;
        /// @notice max mint per block this given asset
        uint128 maxMintPerBlock;
        /// @notice max redeem per block this given asset
        uint128 maxRedeemPerBlock;
    }

    struct BlockTotals {
        /// @notice DSU minted per block / per asset per block
        uint128 mintedPerBlock;
        /// @notice DSU redeemed per block / per asset per block
        uint128 redeemedPerBlock;
    }

    struct GlobalConfig {
        /// @notice max DSU that can be minted across all assets within a single block.
        uint128 globalMaxMintPerBlock;
        /// @notice max DSU that can be redeemed across all assets within a single block.
        uint128 globalMaxRedeemPerBlock;
    }

    /// @notice Event emitted when contract receives ETH
    event Received(address, uint256);

    /// @notice Event emitted when DSU is minted
    event Mint(
        string indexed order_id,
        address indexed benefactor,
        address indexed beneficiary,
        address minter,
        address collateral_asset,
        uint256 collateral_amount,
        uint256 dsu_amount
    );

    /// @notice Event emitted when funds are redeemed
    event Redeem(
        string indexed order_id,
        address indexed benefactor,
        address indexed beneficiary,
        address redeemer,
        address collateral_asset,
        uint256 collateral_amount,
        uint256 dsu_amount
    );

    /// @notice Event emitted when a supported asset is added
    event AssetAdded(address indexed asset);

    /// @notice Event emitted when a supported asset is removed
    event AssetRemoved(address indexed asset);

    /// @notice Event emitted when a benefactor address is added
    event BenefactorAdded(address indexed benefactor);

    /// @notice Event emitted when a beneficiary address is added or updated
    event BeneficiaryAdded(address indexed benefactor, address indexed beneficiary);

    /// @notice Event emitted when a benefactor address is removed
    event BenefactorRemoved(address indexed benefactor);

    /// @notice Event emitted when a beneficiary address is removed
    event BeneficiaryRemoved(address indexed benefactor, address indexed beneficiary);

    // @notice Event emitted when a custodian address is added
    event CustodianAddressAdded(address indexed custodian);

    // @notice Event emitted when a custodian address is removed
    event CustodianAddressRemoved(address indexed custodian);

    /// @notice Event emitted when assets are moved to custody provider wallet
    event CustodyTransfer(address indexed wallet, address indexed asset, uint256 amount);

    /// @notice Event emitted when DSU is set
    event DSUSet(address indexed DSU);

    /// @notice Event emitted when the max mint per block is changed
    event MaxMintPerBlockChanged(uint256 oldMaxMintPerBlock, uint256 newMaxMintPerBlock, address indexed asset);

    /// @notice Event emitted when the max redeem per block is changed
    event MaxRedeemPerBlockChanged(uint256 oldMaxRedeemPerBlock, uint256 newMaxRedeemPerBlock, address indexed asset);

    /// @notice Event emitted when a delegated signer is added, enabling it to sign orders on behalf of another address
    event DelegatedSignerAdded(address indexed signer, address indexed delegator);

    /// @notice Event emitted when a delegated signer is removed
    event DelegatedSignerRemoved(address indexed signer, address indexed delegator);

    /// @notice Event emitted when a delegated signer is initiated
    event DelegatedSignerInitiated(address indexed signer, address indexed delegator);

    /// @notice Event emitted when the token type for a token is set.
    event TokenTypeSet(address indexed token, uint256 tokenType);

    error InvalidAddress();
    error InvalidDSUAddress();
    error InvalidZeroAddress();
    error InvalidAssetAddress();
    error InvalidBenefactorAddress();
    error InvalidBeneficiaryAddress();
    error InvalidCustodianAddress();
    error InvalidOrder();
    error InvalidAmount();
    error InvalidRoute();
    error InvalidStablePrice();
    error UnknownSignatureType();
    error UnsupportedAsset();
    error NoAssetsProvided();
    error BenefactorNotWhitelisted();
    error BeneficiaryNotApproved();
    error InvalidEIP712Signature();
    error InvalidEIP1271Signature();
    error InvalidNonce();
    error SignatureExpired();
    error TransferFailed();
    error DelegationNotInitiated();
    error MaxMintPerBlockExceeded();
    error MaxRedeemPerBlockExceeded();
    error GlobalMaxMintPerBlockExceeded();
    error GlobalMaxRedeemPerBlockExceeded();

    function hashOrder(Order calldata order) external view returns (bytes32);

    function verifyOrder(Order calldata order, Signature calldata signature) external view returns (bytes32);

    function verifyRoute(Route calldata route) external view returns (bool);

    function verifyNonce(address sender, uint128 nonce) external view returns (uint128, uint256, uint256);

    function verifyStablesLimit(
        uint128 collateralAmount,
        uint128 dsuAmount,
        address collateralAsset,
        OrderType orderType
    ) external view returns (bool);

    function mint(Order calldata order, Route calldata route, Signature calldata signature) external;

    function mintWETH(Order calldata order, Route calldata route, Signature calldata signature) external;

    function redeem(Order calldata order, Signature calldata signature) external;
}
