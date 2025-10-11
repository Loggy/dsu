// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.29;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SingleAdminAccessControl
 * @notice Simplified access control with a single admin
 */
abstract contract SingleAdminAccessControl is AccessControl {
    address private _currentAdmin;

    error NotAdmin();

    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    constructor() {
        _currentAdmin = msg.sender;
    }

    /**
     * @notice Returns the current admin address
     */
    function admin() public view returns (address) {
        return _currentAdmin;
    }

    /**
     * @notice Transfers admin role to a new address
     * @param newAdmin The address of the new admin
     */
    function transferAdmin(address newAdmin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newAdmin == address(0)) revert NotAdmin();
        address oldAdmin = _currentAdmin;
        _currentAdmin = newAdmin;
        emit AdminTransferred(oldAdmin, newAdmin);
    }
}
