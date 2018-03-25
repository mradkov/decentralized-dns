pragma solidity 0.4.21;

import './Ownable.sol';

contract Destructible is Ownable {
    
    function Destructible() public payable { }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
    
    function destroyAndSend(address _recipient) public onlyOwner {
        selfdestruct(_recipient);
    }
}