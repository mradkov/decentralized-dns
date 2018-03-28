pragma solidity 0.4.21;

import './common/Ownable.sol';
import './common/Destructible.sol';
import './libs/SafeMath.sol';
import './interfaces/DDNS.sol';

contract DDNSService is Destructible, DDNS {

    using SafeMath for uint256;

    struct DomainDetails {
        address owner;
        bytes4 ip;
        uint expires;
    }

    uint constant private DOMAIN_NAME_COST = 1 ether;
    uint constant private DOMAIN_EXPIRATION_DATE = 1 years;
    
    mapping (bytes => DomainDetails) private domainNames;

    modifier isAvailable(bytes domain) {
        require(domainNames[domain].expires < block.timestamp);
        _;
    }

    modifier collectDomainNamePayment() {
        require(msg.value >= DOMAIN_NAME_COST);
        uint extraMoney = msg.value - DOMAIN_NAME_COST;
        if (extraMoney > 0) {
            msg.sender.transfer(extraMoney);
        }
        _;
    }

    modifier isDomainOwner(bytes domain) {
        require(domainNames[domain].owner == msg.sender);
        _;
    }

    modifier isDomainActive(bytes domain) {
        // require(domainNames[domain].is);
        _;
    }

    /**
     *  EVENTS
     */
    
    function DDNSService() public {
        
    }
    
    /*
     * @dev - function to regiter domain name
     * @param domain - domain name to be registered
     * @param ip - the ip of the host
     */
    function register(bytes domain, bytes4 ip) public payable isAvailable(domain) collectDomainNamePayment {
        
        DomainDetails memory newDomain = DomainDetails({owner: msg.sender, ip: ip, expires: block.timestamp + DOMAIN_EXPIRATION_DATE});
        domainNames[domain] = newDomain;

    }
    
    /*
     * @dev - function to edit domain name
     * @param domain - the domain name to be editted
     * @param newIp - the new ip for the domain
     */
    function edit(bytes domain, bytes4 newIp) public isDomainOwner(domain) {
        domainNames[domain].ip = newIp;
    }
    
    /*
     * @dev -
     * @param 
     * @return
     */
    function transferDomain(bytes domain, address newOwner) public isDomainOwner(domain) {
        domainNames[domain].owner = newOwner;
    }
    
    /*
     * @dev -
     * @param 
     * @return
     */
    function getIP(bytes domain) public view returns (bytes4) {
        return domainNames[domain].ip;
    }
    
    /*
     * @dev -
     * @param 
     * @return
     */
    function getPrice(bytes domain) public view returns (uint) {

    }

    
}