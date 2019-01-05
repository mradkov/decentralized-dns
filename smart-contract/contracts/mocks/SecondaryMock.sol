pragma solidity >=0.4.24 <0.6.0;

import "../common/Secondary.sol";

contract SecondaryMock is Secondary {
    function onlyPrimaryMock() public view onlyPrimary {}
}