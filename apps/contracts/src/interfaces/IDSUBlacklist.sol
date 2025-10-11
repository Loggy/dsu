// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

interface IDSUBlacklist is IAccessControl {
    // Events
    event AddedToBlacklist(address account);
    event RemovedFromBlacklist(address account);

    // Errors
    error ZeroAddressCannotBlacklisted();
    error AccountAlreadyBlacklisted();
    error AccountNotBlacklisted();

    // Constants
    function BLACKLIST_ROLE() external view returns (bytes32);

    // Functions
    function addToBlacklist(address account) external;
    function removeFromBlacklist(address account) external;
    function batchBlacklist(address[] memory accounts, bool toBeBlacklisted) external;
    function isBlacklisted(address account) external view returns (bool);
}
