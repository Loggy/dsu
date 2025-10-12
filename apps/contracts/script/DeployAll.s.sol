// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {Script, console} from "forge-std/Script.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import {MockWETH} from "../src/mocks/MockWETH.sol";
import {MockLayerZeroEndpoint} from "../src/mocks/MockLayerZeroEndpoint.sol";
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
 * @title DeployAll
 * @notice Complete local deployment script - mocks + full system in one go
 */
contract DeployAll is Script {
    // Deployment addresses
    address public weth;
    address public lzEndpoint;
    address public blacklist;
    address public dsuImpl;
    address public dsuProxy;
    address public dsuMinting;
    address public oftAdapter;
    address public silo;
    address public vaultImpl;
    address public vaultProxy;

    // Configuration
    address public admin;
    address public treasury;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        admin = vm.envOr("ADMIN_ADDRESS", vm.addr(deployerPrivateKey));
        treasury = vm.envOr("TREASURY_ADDRESS", address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8));

        console.log("==============================================");
        console.log("DSU Complete Local Deployment");
        console.log("==============================================");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("Admin:", admin);
        console.log("Treasury:", treasury);
        console.log("");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy mocks
        console.log("Step 1: Deploying Mocks...");
        weth = address(new MockWETH());
        lzEndpoint = address(new MockLayerZeroEndpoint(40161));
        console.log("   MockWETH:", weth);
        console.log("   MockLayerZero:", lzEndpoint);
        console.log("");

        // Deploy DSUBlacklist
        console.log("Step 2: Deploying DSUBlacklist...");
        blacklist = address(new DSUBlacklist(admin));
        console.log("   DSUBlacklist:", blacklist);
        console.log("");

        // Deploy DSU (UUPS)
        console.log("Step 3: Deploying DSU...");
        dsuImpl = address(new DSU(blacklist));
        bytes memory dsuInitData = abi.encodeWithSelector(
            DSU.initialize.selector,
            admin, // admin
            admin, // pauser
            admin, // minter
            admin // upgrader
        );
        dsuProxy = address(new ERC1967Proxy(dsuImpl, dsuInitData));
        console.log("   DSU Implementation:", dsuImpl);
        console.log("   DSU Proxy:", dsuProxy);
        console.log("");

        // Deploy DSUMinting
        console.log("Step 4: Deploying DSUMinting...");
        address[] memory collateralAssets = new address[](1);
        collateralAssets[0] = weth;

        IDSUMinting.TokenConfig[] memory tokenConfigs = new IDSUMinting.TokenConfig[](1);
        tokenConfigs[0] = IDSUMinting.TokenConfig({
            tokenType: IDSUMinting.TokenType.STABLE,
            isActive: true,
            maxMintPerBlock: 50000 ether,
            maxRedeemPerBlock: 50000 ether
        });

        IDSUMinting.GlobalConfig memory globalConfig =
            IDSUMinting.GlobalConfig({globalMaxMintPerBlock: 100000 ether, globalMaxRedeemPerBlock: 100000 ether});

        address[] memory custodians = new address[](0);

        dsuMinting = address(
            new DSUMinting(
                IDSU(dsuProxy), IWETH9(weth), collateralAssets, tokenConfigs, globalConfig, custodians, admin
            )
        );
        console.log("   DSUMinting:", dsuMinting);
        console.log("");

        // Grant MINTER_ROLE to DSUMinting
        console.log("Step 5: Granting MINTER_ROLE...");
        DSU(dsuProxy).grantRole(DSU(dsuProxy).MINTER_ROLE(), dsuMinting);
        console.log("   MINTER_ROLE granted to DSUMinting");
        console.log("");

        // Deploy DSUOFTAdapter
        console.log("Step 6: Deploying DSUOFTAdapter...");
        oftAdapter = address(new DSUOFTAdapter(dsuProxy, lzEndpoint, admin));
        console.log("   DSUOFTAdapter:", oftAdapter);
        console.log("");

        // Deploy DSUSilo
        console.log("Step 7: Deploying DSUSilo...");
        silo = address(new DSUSilo(dsuProxy));
        console.log("   DSUSilo:", silo);
        console.log("");

        // Deploy DSUVault (UUPS)
        console.log("Step 8: Deploying DSUVault...");
        vaultImpl = address(new DSUVault(treasury));
        bytes memory vaultInitData = abi.encodeWithSelector(
            DSUVault.initialize.selector,
            dsuProxy,
            admin,
            "Staked DSU",
            "sDSU",
            DSUSilo(silo),
            uint32(7 days),
            uint24(1 days) // Must be non-zero initially, can set to 0 later if needed
        );
        vaultProxy = address(new ERC1967Proxy(vaultImpl, vaultInitData));
        DSUVault(vaultProxy).grantRole(DSUVault(vaultProxy).REWARDER_ROLE(), admin);
        console.log("   DSUVault Implementation:", vaultImpl);
        console.log("   DSUVault Proxy:", vaultProxy);
        console.log("");

        vm.stopBroadcast();

        // Print summary
        console.log("==============================================");
        console.log("DEPLOYMENT COMPLETE!");
        console.log("==============================================");
        console.log("");
        console.log("CONTRACT ADDRESSES FOR FRONTEND:");
        console.log("-----------------------------------");
        console.log("DSU (Token):      ", dsuProxy);
        console.log("DSUMinting:       ", dsuMinting);
        console.log("DSUVault (Vault): ", vaultProxy);
        console.log("MockWETH:         ", weth);
        console.log("DSUBlacklist:     ", blacklist);
        console.log("DSUOFTAdapter:    ", oftAdapter);
        console.log("DSUSilo:          ", silo);
        console.log("");
        console.log("NETWORK INFO:");
        console.log("-----------------------------------");
        console.log("RPC URL:   http://127.0.0.1:8545");
        console.log("Chain ID:  31337");
        console.log("Admin:     ", admin);
        console.log("Treasury:  ", treasury);
        console.log("");
        console.log("==============================================");
    }
}
