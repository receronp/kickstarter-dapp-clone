// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    Request[] public requests;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum) {
        manager = msg.sender;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
    }

    function createRequest(
        string memory description,
        uint value,
        address payable recipient
    ) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false
        });

        requests.push(newRequest);
    }

    function approveRequest() public {}
}
