pragma solidity >=0.4.22 <0.6.0;

import "./common/Ownable.sol";
import "./common/Destructible.sol";
import "./libs/SafeMath.sol";


contract DDNSService is Destructible {
    
    /** USINGS */
    using SafeMath for uint256;

    /** STRUCTS */
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

    /** CONSTANTS */
    uint constant public DOMAIN_NAME_COST = 1 ether;
    uint constant public DOMAIN_NAME_COST_SHORT_ADDITION = 1 ether;
    uint constant public DOMAIN_EXPIRATION_DATE = 365 days;
    uint8 constant public DOMAIN_NAME_MIN_LENGTH = 5;
    uint8 constant public DOMAIN_NAME_EXPENSIVE_LENGTH = 8;
    uint8 constant public TOP_LEVEL_DOMAIN_MIN_LENGTH = 1;
    bytes1 constant public BYTES_DEFAULT_VALUE = bytes1(0x00);
    
    /** STATE VARIABLES */
    mapping (bytes32 => DomainDetails) public domainNames;
    mapping(address => bytes32[]) public paymentReceipts;
    mapping(bytes32 => Receipt) public receiptDetails;

    /** 
     * MODIFIERS
     */
    modifier isAvailable(bytes memory domain, bytes12 topLevel) {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        require(
            domainNames[domainHash].expires < block.timestamp,
            "Domain name is not available."
        );
        _;
    }

    modifier collectDomainNamePayment(bytes memory domain) {
        uint domainPrice = getPrice(domain);
        require(
            msg.value >= domainPrice, 
            "Insufficient amount."
        );
        _;
    }

    modifier isDomainOwner(bytes memory domain, bytes12 topLevel) {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        require(
            domainNames[domainHash].owner == msg.sender,
            "You are not the owner of this domain."
        );
        _;
    }

    modifier isDomainNameLengthAllowed(bytes memory domain) {
        require(
            domain.length >= DOMAIN_NAME_MIN_LENGTH,
            "Domain name is too short."
        );
        _;
    }

    modifier isTopLevelLengthAllowed(bytes12 topLevel) {
        require(
            topLevel.length >= TOP_LEVEL_DOMAIN_MIN_LENGTH,
            "The provided TLD is too short."
        );
        _;
    }

    /**
     *  EVENTS
     */
    event LogDomainNameRegistered(
        uint indexed timestamp, 
        bytes domainName, 
        bytes12 topLevel
    );

    event LogDomainNameRenewed(
        uint indexed timestamp, 
        bytes domainName, 
        bytes12 topLevel, 
        address indexed owner
    ); 

    event LogDomainNameEdited(
        uint indexed timestamp, 
        bytes domainName, 
        bytes12 topLevel, 
        bytes15 newIp
    ); 

    event LogDomainNameTransferred(
        uint indexed timestamp, 
        bytes domainName, 
        bytes12 topLevel, 
        address indexed owner, 
        address newOwner
    );

    event LogPurchaseChangeReturned(
        uint indexed timestamp, 
        address indexed _owner, 
        uint amount
    );

    event LogReceipt(
        uint indexed timestamp, 
        bytes domainName, 
        uint amountInWei, 
        uint expires
    );

    /**
     * @dev - Constructor of the contract
     */
    constructor() public {
        
    }
    
    /*
     * @dev - function to regiter domain name
     * @param domain - domain name to be registered
     * @param topLevel - domain top level
     * @param ip - the ip of the host
     */
    function register(
        bytes memory domain,
        bytes12 topLevel,
        bytes15 ip
    ) 
        public
        payable 
        isDomainNameLengthAllowed(domain) 
        isTopLevelLengthAllowed(topLevel) 
        isAvailable(domain, topLevel) 
        collectDomainNamePayment(domain) 
    {
        
        bytes32 domainHash = getDomainHash(domain, topLevel);

        DomainDetails memory newDomain = DomainDetails(
            {
                name: domain,
                topLevel: topLevel,
                owner: msg.sender,
                ip: ip,
                expires: block.timestamp + DOMAIN_EXPIRATION_DATE
            }
        );

        domainNames[domainHash] = newDomain;
        
        Receipt memory newReceipt = Receipt(
            {
                amountPaidWei: DOMAIN_NAME_COST,
                timestamp: block.timestamp,
                expires: block.timestamp + DOMAIN_EXPIRATION_DATE
            }
        );

        bytes32 receiptKey = getReceiptKey(domain, topLevel);
        
        paymentReceipts[msg.sender].push(receiptKey);
        
        receiptDetails[receiptKey] = newReceipt;

        emit LogReceipt(
            block.timestamp, 
            domain, 
            DOMAIN_NAME_COST, 
            block.timestamp + DOMAIN_EXPIRATION_DATE
        );
    
        emit LogDomainNameRegistered(
            block.timestamp, 
            domain, 
            topLevel
        );
    }

    /*
     * @dev - function to extend domain expiration date
     * @param domain - domain name to be registered
     * @param topLevel - top level
     */
    function renewDomainName(
        bytes memory domain,
        bytes12 topLevel
    ) 
        public 
        payable 
        isDomainOwner(domain, topLevel)
        collectDomainNamePayment(domain)
    {
        //
        bytes32 domainHash = getDomainHash(domain, topLevel);
        
        //
        domainNames[domainHash].expires += 365 days;
        
        //
        Receipt memory newReceipt = Receipt(
            {
                amountPaidWei: DOMAIN_NAME_COST,
                timestamp: block.timestamp,
                expires: block.timestamp + DOMAIN_EXPIRATION_DATE
            }
        );

        //
        bytes32 receiptKey = getReceiptKey(domain, topLevel);
        
        //
        paymentReceipts[msg.sender].push(receiptKey);
        receiptDetails[receiptKey] = newReceipt;

        emit LogDomainNameRenewed(block.timestamp, domain, topLevel, msg.sender);
    }
    
    /*
     * @dev - function to edit domain name
     * @param domain - the domain name to be editted
     * @param topLevel
     * @param newIp - the new ip for the domain
     */
    function edit(bytes memory domain, bytes12 topLevel, bytes15 newIp) public isDomainOwner(domain, topLevel) {
        bytes32 domainHash = getDomainHash(domain, topLevel);        
        domainNames[domainHash].ip = newIp;
        emit LogDomainNameEdited(block.timestamp, domain, topLevel, newIp);
    }
    
    /*
     * @dev - Transfer domain ownership
     * @param domain
     * @param topLevel
     * @param newOwner
     */
    function transferDomain(
        bytes memory domain,
        bytes12 topLevel,
        address newOwner
    ) 
        public 
        isDomainOwner(domain, topLevel)
    {
        //
        require(newOwner != address(0));
        
        //
        bytes32 domainHash = getDomainHash(domain, topLevel);
        
        //
        domainNames[domainHash].owner = newOwner;
        
        //
        emit LogDomainNameTransferred(
            block.timestamp,
            domain, topLevel,
            msg.sender,
            newOwner
        );
    }
    
    /*
     * @dev - Get ip of domain
     * @param domain
     * @param topLevel
     */
    function getIP(
        bytes memory domain,
        bytes12 topLevel
    ) 
        public 
        view 
        returns (bytes15)
    {
        //
        bytes32 domainHash = getDomainHash(domain, topLevel);
        
        //
        return domainNames[domainHash].ip;
    }
    
    /*
     * @dev - Get price of domain
     * @param domain
     */
    function getPrice(
        bytes memory domain
    )
        public
        pure
        returns (uint) 
    {
        //
        if (domain.length < DOMAIN_NAME_EXPENSIVE_LENGTH) {
            //
            return DOMAIN_NAME_COST + DOMAIN_NAME_COST_SHORT_ADDITION;
        }

        //
        return DOMAIN_NAME_COST;
    }
    
    /**
     * @dev - Get receipts
     */
    function getReceiptList() public view returns (bytes32[] memory) {
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
    function getDomainHash(bytes memory domain, bytes12 topLevel) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(domain, topLevel));
    } 

    /*
     * @dev - Get recepit key
     * @param domain
     * @param topLevel
     * @return receiptKey
     */
    function getReceiptKey(bytes memory domain, bytes12 topLevel) public view returns(bytes32) {
        // @dev - tightly pack parameters in struct for keccak256
        return keccak256(abi.encodePacked(domain, topLevel, msg.sender, block.timestamp));
    } 

    /**
     * @dev - Withdraw function 
     */
    function withdraw() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }
}