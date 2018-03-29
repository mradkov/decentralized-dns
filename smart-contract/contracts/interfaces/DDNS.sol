pragma solidity ^0.4.18;

contract DDNS {
    struct Receipt{
        uint amountPaidWei;
        uint timestamp;
        uint expires;
    }
    
    //This will create an automatic getter with 2 arguments: address and index of receipt
    mapping(address => Receipt[]) public receipts;

    //the domain is bytes, because string is UTF-8 encoded and we cannot get its length
    //the IP is bytes4 because it is more efficient in storing the sequence
    function register(bytes domain, bytes4 ip) public payable {}
    
    function edit(bytes domain, bytes4 newIp) public {}
    
    function transferDomain(bytes domain, address newOwner) public {}
    
    function getIP(bytes domain) public view returns (bytes4) {}
    
    function getPrice(bytes domain) public view returns (uint) {}
}