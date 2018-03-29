pragma solidity ^0.4.18;

import './common/Ownable.sol';
import './common/Destructible.sol';
import './libs/SafeMath.sol';
import './interfaces/DDNS.sol';

contract DDNSService is Destructible, DDNS {

    using SafeMath for uint256;

    struct DomainDetails {
        bytes name;
        bytes12 topLevel;
        address owner;
        bytes4 ip;
        uint expires;
    }

    uint constant private DOMAIN_NAME_COST = 1 ether;
    uint constant private DOMAIN_EXPIRATION_DATE = 1 years;
    uint8 public constant DOMAIN_NAME_MIN_LENGTH = 5;
    uint8 public constant TOP_LEVEL_DOMAIN_MIN_LENGTH = 1;
    bytes1 public constant BYTES_DEFAULT_VALUE = bytes1(0x00);
    
    mapping (bytes32 => DomainDetails) private domainNames;

    modifier isAvailable(bytes domain, bytes12 topLevel) {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        require(domainNames[domainHash].expires < block.timestamp);
        _;
    }

    modifier collectDomainNamePayment() {
        require(msg.value >= DOMAIN_NAME_COST);
        _;
    }

    modifier isDomainOwner(bytes domain, bytes12 topLevel) {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        require(domainNames[domainHash].owner == msg.sender);
        _;
    }

    modifier isDomainNameLengthAllowed(bytes domain) {
        require(domain.length > DOMAIN_NAME_MIN_LENGTH);
        _;
    }

    /**
     *  EVENTS
     */
    event LogDomainNameRegistered(uint indexed timestamp, bytes indexed domainName, bytes12 indexed topLevel, address owner);
    event LogDomainNameRenewed(uint indexed timestamp, bytes indexed domainName, bytes12 indexed topLevel, address owner); 
    event LogDomainNameEdited(uint indexed timestamp, bytes indexed domainName, bytes12 topLevel, address indexed owner); 
    event LogDomainNameTransferred(uint indexed timestamp, bytes indexed domainName, bytes12 topLevel, address indexed owner, address newOwner); 
    event LogPurchaseChangeReturned(uint indexed timestamp, address indexed _owner, uint indexed amount); 


    function DDNSService() public {
        
    }
    
    /*
     * @dev - function to regiter domain name
     * @param domain - domain name to be registered
     * @param ip - the ip of the host
     */
    function register(bytes domain, bytes12 topLevel, bytes4 ip) public payable isDomainNameLengthAllowed(domain) isAvailable(domain, topLevel) collectDomainNamePayment {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        DomainDetails memory newDomain = DomainDetails({name: domain, topLevel: topLevel, owner: msg.sender, ip: ip, expires: block.timestamp + DOMAIN_EXPIRATION_DATE});
        domainNames[domainHash] = newDomain;
        Receipt memory newReceipt = Receipt({amountPaidWei: DOMAIN_NAME_COST, timestamp: block.timestamp, expires: block.timestamp + DOMAIN_EXPIRATION_DATE});
        receipts[msg.sender].push(newReceipt);
        LogDomainNameRegistered(block.timestamp, domain, topLevel, msg.sender);
    }

    /*
     * @dev - function to extend domain expiration date
     * @param domain - domain name to be registered
     * @param ip - the ip of the host
     */
    function renewDomainName(bytes domain, bytes12 topLevel) public payable isDomainOwner(domain, topLevel) collectDomainNamePayment {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        domainNames[domainHash].expires += 1 years;
        Receipt memory newReceipt = Receipt({amountPaidWei: DOMAIN_NAME_COST, timestamp: block.timestamp, expires: block.timestamp + DOMAIN_EXPIRATION_DATE});
        receipts[msg.sender].push(newReceipt);
        LogDomainNameRenewed(block.timestamp, domain, topLevel, msg.sender);
    }
    
    /*
     * @dev - function to edit domain name
     * @param domain - the domain name to be editted
     * @param newIp - the new ip for the domain
     */
    function edit(bytes domain, bytes12 topLevel, bytes4 newIp) public isDomainOwner(domain, topLevel) {
        bytes32 domainHash = getDomainHash(domain, topLevel);        
        domainNames[domainHash].ip = newIp;
        LogDomainNameEdited(block.timestamp, domain, topLevel, msg.sender);
    }
    
    /*
     * @dev -
     * @param 
     * @return
     */
    function transferDomain(bytes domain, bytes12 topLevel, address newOwner) public isDomainOwner(domain, topLevel) {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        domainNames[domainHash].owner = newOwner;
        LogDomainNameTransferred(block.timestamp, domain, topLevel, msg.sender, newOwner);
    }
    
    /*
     * @dev -
     * @param 
     * @return
     */
    function getIP(bytes domain, bytes12 topLevel) public view returns (bytes4) {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        return domainNames[domainHash].ip;
    }
    
    /*
     * @dev -
     * @param 
     * @return
     */
    function getPrice(bytes domain) public view returns (uint) {
        
    }
    
    /*
     * @dev - Get receipts 
     * @param 
     * @return
     */
    function getReceiptList() public view returns (Receipt[]) {
        return receipts[msg.sender];
    }

    /*
     * @dev - Get domain name + top level hash 
     * @param domain
     * @param topLevel
     * @return
     */
    function getDomainHash(bytes domain, bytes12 topLevel) internal pure returns(bytes32) {
        return keccak256(domain, topLevel);
    } 

    /*
     * @dev - Get receipts 
     * @param 
     * @return
     */
    function withdraw() public onlyOwner {
        owner.transfer(address(this).balance);
    }
}