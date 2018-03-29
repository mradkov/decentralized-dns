pragma solidity ^0.4.18;


contract Ownable {
    address public owner;

    event LogOwnershipTransfered(address indexed _currentOwner, address indexed _newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function Ownable() public {
        owner = msg.sender;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        owner = _newOwner;
        LogOwnershipTransfered(msg.sender, _newOwner);
    }
}