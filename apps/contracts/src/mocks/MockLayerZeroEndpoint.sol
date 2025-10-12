// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

/**
 * @title MockLayerZeroEndpoint
 * @notice Mock LayerZero endpoint for local testing
 */
contract MockLayerZeroEndpoint {
    uint32 public eid;
    mapping(address => address) public delegates;

    event DelegateSet(address indexed oapp, address indexed delegate);

    constructor(uint32 _eid) {
        eid = _eid;
    }

    function send(
        address, /* _oapp */
        uint32, /* _dstEid */
        bytes calldata, /* _message */
        bytes calldata, /* _options */
        address /* _refundAddress */
    ) external payable returns (bytes32) {
        return bytes32(0);
    }

    function quote(
        address, /* _oapp */
        uint32, /* _dstEid */
        bytes calldata, /* _message */
        bytes calldata, /* _options */
        bool /* _payInLzToken */
    ) external pure returns (uint256, uint256) {
        return (0, 0);
    }

    function setDelegate(address _delegate) external {
        delegates[msg.sender] = _delegate;
        emit DelegateSet(msg.sender, _delegate);
    }
}
