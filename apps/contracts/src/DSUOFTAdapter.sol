// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.29;

import { OFTAdapter } from "@layerzerolabs/oft-evm/contracts/OFTAdapter.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/// @notice OFTAdapter uses a deployed ERC-20 token and SafeERC20 to interact with the OFTCore contract.
contract DSUOFTAdapter is OFTAdapter {
    constructor(
        address _token,
        address _lzEndpoint,
        address _owner
    ) OFTAdapter(_token, _lzEndpoint, _owner) Ownable(_owner) {}
}