// SPDX-License-Identifier: MIT
pragma solidity >=0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDfSilo {

    IERC20 private immutable _USDF;
    address private _stakingVault;

    error OnlyStakingVault();
    error AlreadySet();

    constructor(address usdf) {
        _USDF = IERC20(usdf);
    }

    modifier onlyStakingVault() {
        if (msg.sender != _stakingVault) {
            revert OnlyStakingVault();
        }
        _;
    }

    function setStakingVault() external {
        require(_stakingVault == address(0), AlreadySet());
        _stakingVault = msg.sender;
    }

    function withdraw(address to, uint256 amount) external onlyStakingVault {
        _USDF.transfer(to, amount);
    }

}
