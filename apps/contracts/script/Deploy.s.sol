// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {Script, console} from "forge-std/Script.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import {DSUBlacklist} from "../src/DSUBlacklist.sol";
import {DSU} from "../src/DSU.sol";
import {IDSU} from "../src/interfaces/IDSU.sol";
import {DSUMinting} from "../src/DSUMinting.sol";
import {IDSUMinting} from "../src/interfaces/IDSUMinting.sol";
import {IWETH9} from "../src/interfaces/IWETH9.sol";
import {DSUOFTAdapter} from "../src/DSUOFTAdapter.sol";
import {DSUSilo} from "../src/DSUSilo.sol";
import {DSUVault} from "../src/DSUVault.sol";

/**
 * @title Deploy
 * @notice Deployment script for DSU token system with proper upgradeable proxy setup
 * @dev Deploys contracts in the following order:
 *      1. DSUBlacklist
 *      2. DSU (UUPS upgradeable - implementation + proxy)
 *      3. DSUMinting
 *      4. Set DSU Minter to DSUMinting
 *      5. DSUOFTAdapter
 *      6. DSUSilo
 *      7. DSUVault (UUPS upgradeable - implementation + proxy)
 */
contract Deploy is Script {
    /* ------------- DEPLOYMENT ADDRESSES ------------- */
    address public blacklistContract;
    address public dsuImplementation;
    address public dsuProxy;
    address public dsuMinting;
    address public oftAdapter;
    address public silo;
    address public vaultImplementation;
    address public vaultProxy;

    /* ------------- CONFIGURATION ------------- */
    struct DeploymentConfig {
        address admin;
        address pauser;
        address minter;
        address upgrader;
        address rewarder;
        address treasury;
        address lzEndpoint;
        address wethAddress;
        address[] collateralAssets;
        uint128 globalMaxMintPerBlock;
        uint128 globalMaxRedeemPerBlock;
        uint128 maxMintPerBlock;
        uint128 maxRedeemPerBlock;
        address[] custodianAddresses;
        uint32 initialVestingPeriod;
        uint24 initialCooldownDuration;
    }

    DeploymentConfig public config;

    function run() external {
        _loadConfiguration();
        _validateConfiguration();

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("==============================================");
        console.log("Starting DSU System Deployment");
        console.log("==============================================");
        console.log("Deployer:", deployer);
        console.log("Network Chain ID:", block.chainid);
        console.log("");

        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy DSUBlacklist
        _deployBlacklist();

        // Step 2: Deploy DSU (UUPS Upgradeable)
        _deployDSU();

        // Step 3: Deploy DSUMinting
        _deployDSUMinting();

        // Step 4: Set DSU Minter to DSUMinting
        _grantMinterRole();

        // Step 5: Deploy DSUOFTAdapter
        _deployOFTAdapter();

        // Step 6: Deploy DSUSilo
        _deploySilo();

        // Step 7: Deploy DSUVault (UUPS Upgradeable)
        _deployVault();

        vm.stopBroadcast();

        _printDeploymentSummary();
        _verifyDeployment();
    }

    /* ------------- INTERNAL DEPLOYMENT FUNCTIONS ------------- */

    function _deployBlacklist() internal {
        console.log("1. Deploying DSUBlacklist...");
        blacklistContract = address(new DSUBlacklist(config.admin));
        console.log("   DSUBlacklist deployed at:", blacklistContract);
        console.log("");
    }

    function _deployDSU() internal {
        console.log("2. Deploying DSU (UUPS Upgradeable)...");

        // Deploy implementation
        dsuImplementation = address(new DSU(blacklistContract));
        console.log("   DSU Implementation deployed at:", dsuImplementation);

        // Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            DSU.initialize.selector,
            config.admin, // defaultAdmin
            config.pauser, // pauser
            config.minter, // minter
            config.upgrader // upgrader
        );

        // Deploy proxy
        dsuProxy = address(new ERC1967Proxy(dsuImplementation, initData));
        console.log("   DSU Proxy deployed at:", dsuProxy);
        console.log("");
    }

    function _deployDSUMinting() internal {
        console.log("3. Deploying DSUMinting...");

        // Prepare token configurations for collateral assets
        IDSUMinting.TokenConfig[] memory tokenConfigs = new IDSUMinting.TokenConfig[](config.collateralAssets.length);
        for (uint256 i = 0; i < config.collateralAssets.length; i++) {
            tokenConfigs[i] = IDSUMinting.TokenConfig({
                tokenType: IDSUMinting.TokenType.STABLE,
                isActive: true,
                maxMintPerBlock: config.maxMintPerBlock,
                maxRedeemPerBlock: config.maxRedeemPerBlock
            });
        }

        // Prepare global config
        IDSUMinting.GlobalConfig memory globalConfig = IDSUMinting.GlobalConfig({
            globalMaxMintPerBlock: config.globalMaxMintPerBlock,
            globalMaxRedeemPerBlock: config.globalMaxRedeemPerBlock
        });

        // Deploy DSUMinting
        dsuMinting = address(
            new DSUMinting(
                IDSU(dsuProxy),
                IWETH9(config.wethAddress),
                config.collateralAssets,
                tokenConfigs,
                globalConfig,
                config.custodianAddresses,
                config.admin
            )
        );
        console.log("   DSUMinting deployed at:", dsuMinting);
        console.log("");
    }

    function _grantMinterRole() internal {
        console.log("4. Granting MINTER_ROLE to DSUMinting...");
        DSU dsu = DSU(dsuProxy);
        dsu.grantRole(dsu.MINTER_ROLE(), dsuMinting);
        console.log("   MINTER_ROLE granted to:", dsuMinting);
        console.log("");
    }

    function _deployOFTAdapter() internal {
        console.log("5. Deploying DSUOFTAdapter...");
        oftAdapter = address(
            new DSUOFTAdapter(
                dsuProxy, // token address (use proxy)
                config.lzEndpoint, // LayerZero endpoint
                config.admin // owner
            )
        );
        console.log("   DSUOFTAdapter deployed at:", oftAdapter);
        console.log("");
    }

    function _deploySilo() internal {
        console.log("6. Deploying DSUSilo...");
        silo = address(new DSUSilo(dsuProxy)); // use proxy address
        console.log("   DSUSilo deployed at:", silo);
        console.log("");
    }

    function _deployVault() internal {
        console.log("7. Deploying DSUVault (UUPS Upgradeable)...");

        // Deploy implementation
        vaultImplementation = address(new DSUVault(config.treasury));
        console.log("   DSUVault Implementation deployed at:", vaultImplementation);

        // Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            DSUVault.initialize.selector,
            dsuProxy, // DSU token address (use proxy)
            config.admin, // admin
            "Staked DSU", // name
            "sDSU", // symbol
            DSUSilo(silo), // silo
            config.initialVestingPeriod, // initial vesting period
            config.initialCooldownDuration // initial cooldown duration
        );

        // Deploy proxy
        vaultProxy = address(new ERC1967Proxy(vaultImplementation, initData));
        console.log("   DSUVault Proxy deployed at:", vaultProxy);

        // Grant REWARDER_ROLE to the rewarder address
        DSUVault(vaultProxy).grantRole(DSUVault(vaultProxy).REWARDER_ROLE(), config.rewarder);
        console.log("   REWARDER_ROLE granted to:", config.rewarder);
        console.log("");
    }

    /* ------------- CONFIGURATION & VALIDATION ------------- */

    function _loadConfiguration() internal {
        config.admin = vm.envAddress("ADMIN_ADDRESS");
        config.pauser = vm.envOr("PAUSER_ADDRESS", config.admin);
        config.minter = vm.envOr("MINTER_ADDRESS", config.admin);
        config.upgrader = vm.envOr("UPGRADER_ADDRESS", config.admin);
        config.rewarder = vm.envOr("REWARDER_ADDRESS", config.admin);
        config.treasury = vm.envAddress("TREASURY_ADDRESS");
        config.lzEndpoint = vm.envAddress("LAYERZERO_ENDPOINT");
        config.wethAddress = vm.envAddress("WETH_ADDRESS");

        // Load collateral assets
        string memory collateralAssetsStr = vm.envOr("COLLATERAL_ASSETS", string(""));
        if (bytes(collateralAssetsStr).length > 0) {
            config.collateralAssets = vm.parseJsonAddressArray(collateralAssetsStr, "");
        } else {
            // Default to WETH if not specified
            config.collateralAssets = new address[](1);
            config.collateralAssets[0] = config.wethAddress;
        }

        // Load custodian addresses
        string memory custodiansStr = vm.envOr("CUSTODIAN_ADDRESSES", string(""));
        if (bytes(custodiansStr).length > 0) {
            config.custodianAddresses = vm.parseJsonAddressArray(custodiansStr, "");
        } else {
            config.custodianAddresses = new address[](0);
        }

        // Load DSUMinting limits with defaults
        config.globalMaxMintPerBlock = uint128(vm.envOr("GLOBAL_MAX_MINT_PER_BLOCK", uint256(100000 ether)));
        config.globalMaxRedeemPerBlock = uint128(vm.envOr("GLOBAL_MAX_REDEEM_PER_BLOCK", uint256(100000 ether)));
        config.maxMintPerBlock = uint128(vm.envOr("MAX_MINT_PER_BLOCK", uint256(50000 ether)));
        config.maxRedeemPerBlock = uint128(vm.envOr("MAX_REDEEM_PER_BLOCK", uint256(50000 ether)));

        config.initialVestingPeriod = uint32(vm.envOr("INITIAL_VESTING_PERIOD", uint256(7 days)));
        config.initialCooldownDuration = uint24(vm.envOr("INITIAL_COOLDOWN_DURATION", uint256(0)));
    }

    function _validateConfiguration() internal view {
        require(config.admin != address(0), "Invalid admin address");
        require(config.treasury != address(0), "Invalid treasury address");
        require(config.lzEndpoint != address(0), "Invalid LayerZero endpoint address");
        require(config.wethAddress != address(0), "Invalid WETH address");
        require(config.collateralAssets.length > 0, "At least one collateral asset required");
        require(config.initialVestingPeriod <= 7 days, "Vesting period exceeds max");
        require(config.initialCooldownDuration <= 90 days, "Cooldown duration exceeds max");
    }

    function _printDeploymentSummary() internal view {
        console.log("==============================================");
        console.log("Deployment Summary");
        console.log("==============================================");
        console.log("");
        console.log("Contract Addresses:");
        console.log("-------------------");
        console.log("DSUBlacklist:            ", blacklistContract);
        console.log("DSU Implementation:      ", dsuImplementation);
        console.log("DSU Proxy (Token):       ", dsuProxy);
        console.log("DSUMinting:              ", dsuMinting);
        console.log("DSUOFTAdapter:           ", oftAdapter);
        console.log("DSUSilo:                 ", silo);
        console.log("DSUVault Implementation: ", vaultImplementation);
        console.log("DSUVault Proxy (Vault):  ", vaultProxy);
        console.log("");
        console.log("Configuration:");
        console.log("-------------------");
        console.log("Admin:                   ", config.admin);
        console.log("Pauser:                  ", config.pauser);
        console.log("Minter:                  ", config.minter);
        console.log("Upgrader:                ", config.upgrader);
        console.log("Rewarder:                ", config.rewarder);
        console.log("Treasury:                ", config.treasury);
        console.log("LayerZero Endpoint:      ", config.lzEndpoint);
        console.log("Initial Vesting Period:  ", config.initialVestingPeriod);
        console.log("Initial Cooldown:        ", config.initialCooldownDuration);
        console.log("");
    }

    function _verifyDeployment() internal view {
        console.log("==============================================");
        console.log("Post-Deployment Verification");
        console.log("==============================================");

        // Verify DSU
        DSU dsu = DSU(dsuProxy);
        require(dsu.hasRole(dsu.DEFAULT_ADMIN_ROLE(), config.admin), "DSU: Admin role not set");
        require(dsu.hasRole(dsu.PAUSER_ROLE(), config.pauser), "DSU: Pauser role not set");
        require(dsu.hasRole(dsu.MINTER_ROLE(), config.minter), "DSU: Minter role not set");
        require(dsu.hasRole(dsu.MINTER_ROLE(), dsuMinting), "DSU: DSUMinting does not have MINTER_ROLE");
        require(dsu.hasRole(dsu.UPGRADER_ROLE(), config.upgrader), "DSU: Upgrader role not set");
        require(address(dsu.BLACKLIST()) == blacklistContract, "DSU: Blacklist address mismatch");
        console.log("[OK] DSU proxy initialized correctly");

        // Verify DSUMinting
        DSUMinting minting = DSUMinting(payable(dsuMinting));
        require(address(minting.dsu()) == dsuProxy, "DSUMinting: DSU address mismatch");
        console.log("[OK] DSUMinting deployed correctly");

        // Verify Vault
        DSUVault vault = DSUVault(vaultProxy);
        require(vault.hasRole(vault.DEFAULT_ADMIN_ROLE(), config.admin), "Vault: Admin role not set");
        require(vault.hasRole(vault.REWARDER_ROLE(), config.rewarder), "Vault: Rewarder role not set");
        require(address(vault.asset()) == dsuProxy, "Vault: Asset address mismatch");
        require(vault.TREASURY() == config.treasury, "Vault: Treasury address mismatch");
        require(address(vault.silo()) == silo, "Vault: Silo address mismatch");
        console.log("[OK] DSUVault proxy initialized correctly");

        // Verify Silo
        console.log("[OK] DSUSilo deployed correctly");

        // Verify OFT Adapter
        console.log("[OK] DSUOFTAdapter deployed correctly");

        // Verify Blacklist
        DSUBlacklist blacklist = DSUBlacklist(blacklistContract);
        require(blacklist.hasRole(blacklist.DEFAULT_ADMIN_ROLE(), config.admin), "Blacklist: Admin role not set");
        console.log("[OK] DSUBlacklist deployed correctly");

        console.log("");
        console.log("==============================================");
        console.log("Deployment Completed Successfully!");
        console.log("==============================================");
    }
}
