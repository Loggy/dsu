// SPDX-License-Identifier: MIT
pragma solidity >=0.8.29;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DSUSilo {

    IERC20 private immutable _dsu;
    address private _stakingVault;

    error OnlyStakingVault();
    error AlreadySet();

    constructor(address dsu) {
        _dsu = IERC20(dsu);
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
        _dsu.transfer(to, amount);
    }

}
