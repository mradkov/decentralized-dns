pragma solidity ^0.4.18;

import './common/Ownable.sol';
import './common/Destructible.sol';
import './libs/SafeMath.sol';

contract DDNSService is Destructible {

    using SafeMath for uint256;

    struct DomainDetails {
        bytes name;
        bytes12 topLevel;
        address owner;
        bytes15 ip;
        uint expires;
    }

    struct Receipt {
        uint amountPaidWei;
        uint timestamp;
        uint expires;
    }

    uint constant public DOMAIN_NAME_COST = 1 ether;
    uint constant public DOMAIN_NAME_COST_SHORT_ADDITION = 1 ether;
    uint constant public DOMAIN_EXPIRATION_DATE = 1 years;
    uint8 public constant DOMAIN_NAME_MIN_LENGTH = 5;
    uint8 public constant DOMAIN_NAME_EXPENSIVE_LENGTH = 8;
    uint8 public constant TOP_LEVEL_DOMAIN_MIN_LENGTH = 1;
    bytes1 public constant BYTES_DEFAULT_VALUE = bytes1(0x00);
    
    mapping (bytes32 => DomainDetails) public domainNames;
    mapping(address => bytes32[]) public paymentReceipts;
    mapping(bytes32 => Receipt) public receiptDetails;

    modifier isAvailable(bytes domain, bytes12 topLevel) {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        require(domainNames[domainHash].expires < block.timestamp);
        _;
    }

    modifier collectDomainNamePayment(bytes domain) {
        uint domainPrice = getPrice(domain);
        require(msg.value >= domainPrice);
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

    modifier isTopLevelLengthAllowed(bytes12 topLevel) {
        require(topLevel.length >= TOP_LEVEL_DOMAIN_MIN_LENGTH);
        _;
    }

    /**
     *  EVENTS
     */
    event LogDomainNameRegistered(uint indexed timestamp, bytes domainName, bytes12 topLevel);
    event LogDomainNameRenewed(uint indexed timestamp, bytes domainName, bytes12 topLevel, address indexed owner); 
    event LogDomainNameEdited(uint indexed timestamp, bytes domainName, bytes12 topLevel, bytes15 newIp); 
    event LogDomainNameTransferred(uint indexed timestamp, bytes domainName, bytes12 topLevel, address indexed owner, address newOwner); 
    event LogPurchaseChangeReturned(uint indexed timestamp, address indexed _owner, uint amount);
    event LogReceipt(uint indexed timestamp, bytes domainName, uint amountInWei, uint expires);


    function DDNSService() public {
        
    }
    
    /*
     * @dev - function to regiter domain name
     * @param domain - domain name to be registered
     * @param topLevel - domain top level
     * @param ip - the ip of the host
     */
    function register(bytes domain, bytes12 topLevel, bytes15 ip) public payable isDomainNameLengthAllowed(domain) isTopLevelLengthAllowed(topLevel) isAvailable(domain, topLevel) collectDomainNamePayment(domain) {
        bytes32 domainHash = getDomainHash(domain, topLevel);

        DomainDetails memory newDomain = DomainDetails({name: domain, topLevel: topLevel, owner: msg.sender, ip: ip, expires: block.timestamp + DOMAIN_EXPIRATION_DATE});
        domainNames[domainHash] = newDomain;
        
        Receipt memory newReceipt = Receipt({amountPaidWei: DOMAIN_NAME_COST, timestamp: block.timestamp, expires: block.timestamp + DOMAIN_EXPIRATION_DATE});
        bytes32 receiptKey = getReceiptKey(domain, topLevel);
        paymentReceipts[msg.sender].push(receiptKey);
        receiptDetails[receiptKey] = newReceipt;
        LogReceipt(block.timestamp, domain, DOMAIN_NAME_COST, block.timestamp + DOMAIN_EXPIRATION_DATE);
    
        LogDomainNameRegistered(block.timestamp, domain, topLevel);
    }

    /*
     * @dev - function to extend domain expiration date
     * @param domain - domain name to be registered
     * @param topLevel - top level
     */
    function renewDomainName(bytes domain, bytes12 topLevel) public payable isDomainOwner(domain, topLevel) collectDomainNamePayment(domain) {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        domainNames[domainHash].expires += 1 years;
        Receipt memory newReceipt = Receipt({amountPaidWei: DOMAIN_NAME_COST, timestamp: block.timestamp, expires: block.timestamp + DOMAIN_EXPIRATION_DATE});
        bytes32 receiptKey = getReceiptKey(domain, topLevel);
        paymentReceipts[msg.sender].push(receiptKey);
        receiptDetails[receiptKey] = newReceipt;

        LogDomainNameRenewed(block.timestamp, domain, topLevel, msg.sender);
    }
    
    /*
     * @dev - function to edit domain name
     * @param domain - the domain name to be editted
     * @param topLevel
     * @param newIp - the new ip for the domain
     */
    function edit(bytes domain, bytes12 topLevel, bytes15 newIp) public isDomainOwner(domain, topLevel) {
        bytes32 domainHash = getDomainHash(domain, topLevel);        
        domainNames[domainHash].ip = newIp;
        LogDomainNameEdited(block.timestamp, domain, topLevel, newIp);
    }
    
    /*
     * @dev - Transfer domain ownership
     * @param domain
     * @pparam topLevel
     * @param newOwner
     */
    function transferDomain(bytes domain, bytes12 topLevel, address newOwner) public isDomainOwner(domain, topLevel) {
        require(newOwner != 0x00);
        bytes32 domainHash = getDomainHash(domain, topLevel);
        domainNames[domainHash].owner = newOwner;
        LogDomainNameTransferred(block.timestamp, domain, topLevel, msg.sender, newOwner);
    }
    
    /*
     * @dev - Get ip of domain
     * @param domain
     * @param topLevel
     */
    function getIP(bytes domain, bytes12 topLevel) public view returns (bytes15) {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        return domainNames[domainHash].ip;
    }
    
    /*
     * @dev - Get price of domain
     * @param domain
     */
    function getPrice(bytes domain) public pure returns (uint) {
        if (domain.length < DOMAIN_NAME_EXPENSIVE_LENGTH) {
            return DOMAIN_NAME_COST + DOMAIN_NAME_COST_SHORT_ADDITION;
        }

        return DOMAIN_NAME_COST;
    }
    
    /*
     * @dev - Get receipts
     */
    function getReceiptList() public view returns (bytes32[]) {
        return paymentReceipts[msg.sender];
    }
    
    /*
     * @dev - Get single receipt
     * @param receiptKey
     */
    function getReceipt(bytes32 receiptKey) public view returns (uint, uint, uint) {
        return (receiptDetails[receiptKey].amountPaidWei,
                receiptDetails[receiptKey].timestamp,
                receiptDetails[receiptKey].expires);
    }

    /*
     * @dev - Get domain name + top level hash 
     * @param domain
     * @param topLevel
     * @return domainHash
     */
    function getDomainHash(bytes domain, bytes12 topLevel) public pure returns(bytes32) {
        return keccak256(domain, topLevel);
    } 

    /*
     * @dev - Get recepit key
     * @param domain
     * @param topLevel
     * @return receiptKey
     */
    function getReceiptKey(bytes domain, bytes12 topLevel) public view returns(bytes32) {
        return keccak256(domain, topLevel, msg.sender, block.timestamp);
    } 

    /*
     * @dev - Withdraw function 
     */
    function withdraw() public onlyOwner {
        owner.transfer(address(this).balance);
    }
}