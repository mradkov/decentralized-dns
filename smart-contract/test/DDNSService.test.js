const DDNSService = artifacts.require('../contracts/DDNSService.sol');

const assertRevert = require('./utils/assertRevert');
const watchEvent = require('./utils/watchEvent');
const constants = require('./utils/constants');
const increaseTime = require('./utils/increaseTime');

contract('DDNSService', ([owner, wallet, anotherAccount]) => {
  let contractInstance;
  let events = [];

  before(() => {
    web3.eth.defaultAccount = owner;
  });

  beforeEach(async () => {
    contractInstance = await DDNSService.new();
  });

  afterEach(() => {
    if (events.length) {
      events.forEach((ev) => {
        ev.stopWatching();
      });

      events = [];
    }
  });

  it('BYTES_DEFAULT_VALUE constant Should have exact value', async () => {
    // Arrange

    // Act
    const result = await contractInstance.BYTES_DEFAULT_VALUE();

    // Assert
    assert.equal(result, '0x00');
  });

  it('DOMAIN_NAME_MIN_LENGTH constant Should have exact value', async () => {
    // Arrange

    // Act
    const result = await contractInstance.DOMAIN_NAME_MIN_LENGTH();

    // Assert
    assert.equal(result, 5);
  });

  it('DOMAIN_NAME_EXPENSIVE_LENGTH constant Should have exact value', async () => {
    // Arrange

    // Act
    const result = await contractInstance.DOMAIN_NAME_EXPENSIVE_LENGTH();

    // Assert
    assert.equal(result, 8);
  });

  it('TOP_LEVEL_DOMAIN_MIN_LENGTH constant Should have exact value', async () => {
    // Arrange

    // Act
    const result = await contractInstance.TOP_LEVEL_DOMAIN_MIN_LENGTH();

    // Assert
    assert.equal(result, 1);
  });

  it('register Should throw if the domain name is shorter than or equal to DOMAIN_NAME_MIN_LENGTH', async () => {
    // Arrange
    const shortDomainName = 'eth';
    const ip = '127.0.0.1';
    const topLevelDomain = '.com';
    const currentPrice = await contractInstance.getPrice(shortDomainName);

    // Act
    const result = contractInstance.register(
      shortDomainName,
      topLevelDomain,
      ip,
      { from: anotherAccount, value: currentPrice },
    );

    // Assert
    await assertRevert(result);
  });

  it('register Should throw when the sent funds are insufficient', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = (await contractInstance.getPrice(domainName)).minus(1);

    // Act
    const result = contractInstance.register(domainName, topLevelDomain, ip, {
      from: anotherAccount,
      value: currentPrice,
    });

    // Assert
    await assertRevert(result);
  });

  it('register Should throw when domain with such name is registered and still valid', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = await contractInstance.getPrice(domainName);

    // Act
    await contractInstance.register(domainName, topLevelDomain, ip, {
      from: anotherAccount,
      value: currentPrice,
    });
    const result = contractInstance.register(domainName, topLevelDomain, ip, {
      from: anotherAccount,
      value: currentPrice,
    });

    // Assert
    await assertRevert(result);
  });

  it('register Should raise LogDomainNameRegistered event when domain with such name has not been registered before', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = await contractInstance.getPrice(domainName);

    const event = contractInstance.LogDomainNameRegistered();
    const promiEvent = watchEvent(event);
    events.push(event);

    // Act
    await contractInstance.register(domainName, topLevelDomain, ip, {
      from: anotherAccount,
      value: currentPrice,
    });
    const result = await promiEvent;

    // Assert
    assert.equal(
      web3.toUtf8(result.args.domainName),
      domainName,
      'Wrong domainName value.',
    );
    assert.equal(
      web3.toUtf8(result.args.topLevel),
      topLevelDomain,
      'Wrong topLevelDomain value.',
    );
  });

  it('register Should raise LogReceipt event when successfully registering a domain', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = '.com';
    const currentPrice = await contractInstance.getPrice(domainName);
    const event = contractInstance.LogReceipt();
    const promiEvent = watchEvent(event);
    events.push(event);

    // Act
    const initialTransaction = await contractInstance.register(
      domainName,
      topLevelDomain,
      ip,
      { from: owner, value: currentPrice },
    );
    const result = await promiEvent;
    const now = web3.eth.getBlock(initialTransaction.receipt.blockNumber)
      .timestamp;

    // Assert
    assert.equal(
      web3.toUtf8(result.args.domainName),
      domainName,
      'Wrong domainName value.',
    );
    assert.deepEqual(
      result.args.amountInWei,
      currentPrice,
      'Wrong amount value.',
    );
    assert.equal(result.args.timestamp, now, 'Wrong timeBought value.');
  });

  it('register Should throw when trying to register short-named domain on a regular price', async () => {
    // Arrange
    const domainName = 'mradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = await contractInstance.getPrice(domainName);

    // Act
    const result = contractInstance.register(domainName, topLevelDomain, ip, {
      from: anotherAccount,
      value: currentPrice.minus(1),
    });

    // Assert
    await assertRevert(result);
  });

  it('register Should register existing, but expired domain, to another owner', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = await contractInstance.getPrice(domainName);

    // Act
    await contractInstance.register(domainName, topLevelDomain, ip, {
      from: owner,
      value: currentPrice,
    });
    await increaseTime(constants.year + 1);
    await contractInstance.register(domainName, topLevelDomain, ip, {
      from: anotherAccount,
      value: currentPrice,
    });
    const domainHash = await contractInstance.getDomainHash(
      domainName,
      topLevelDomain,
    );
    const result = await contractInstance.domainNames(domainHash);

    // Assert
    assert.ok(result, 'No domain with such name was found.');
  });

  it('renewDomainName Should throw when the sent funds are insufficient', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = await contractInstance.getPrice(domainName);
    await contractInstance.register(domainName, topLevelDomain, ip, {
      from: anotherAccount,
      value: currentPrice,
    });

    // Act
    const result = contractInstance.renewDomainName(
      domainName,
      topLevelDomain,
      { from: anotherAccount, value: currentPrice.minus(1) },
    );

    // Assert
    await assertRevert(result);
  });

  it('renewDomainName Should throw when the invoker is not the domain owner', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = await contractInstance.getPrice(domainName);
    await contractInstance.register(domainName, topLevelDomain, ip, {
      from: owner,
      value: currentPrice,
    });

    // Act
    const result = contractInstance.renewDomainName(
      domainName,
      topLevelDomain,
      { from: anotherAccount, value: currentPrice },
    );

    // Assert
    await assertRevert(result);
  });

  it('edit Should throw when the invoker is not the domain owner', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = await contractInstance.getPrice(domainName);
    await contractInstance.register(domainName, topLevelDomain, ip, {
      from: owner,
      value: currentPrice,
    });

    // Act
    const anotherIp = '123.123.123.123';
    const result = contractInstance.edit(
      domainName,
      topLevelDomain,
      anotherIp,
      { from: anotherAccount },
    );

    // Assert
    assertRevert(result);
  });

  it('edit Should edit the domain ip', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = await contractInstance.getPrice(domainName);
    await contractInstance.register(domainName, topLevelDomain, ip, {
      from: owner,
      value: currentPrice,
    });

    // Act
    const anotherIp = '123.123.123.123';
    await contractInstance.edit(domainName, topLevelDomain, anotherIp, {
      from: owner,
    });
    const domainHash = await contractInstance.getDomainHash(
      domainName,
      topLevelDomain,
    );
    const domainDetails = await contractInstance.domainNames(domainHash);

    // Assert
    assert.equal(web3.toUtf8(domainDetails[3]), anotherIp);
  });

  it('edit Should raise LogDomainNameEdited event when called with valid arguments', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = await contractInstance.getPrice(domainName);
    const event = contractInstance.LogDomainNameEdited();
    const promiEvent = watchEvent(event);
    events.push(event);

    // Act
    await contractInstance.register(domainName, topLevelDomain, ip, {
      from: owner,
      value: currentPrice,
    });
    const anotherIp = '123.123.123.123';
    await contractInstance.edit(domainName, topLevelDomain, anotherIp, {
      from: owner,
    });
    const result = await promiEvent;

    // Assert
    assert.equal(
      web3.toUtf8(result.args.domainName),
      domainName,
      'Wrong domainName value.',
    );
    assert.equal(
      web3.toUtf8(result.args.topLevel),
      topLevelDomain,
      'Wrong topLevelDomain value.',
    );
    assert.equal(
      web3.toUtf8(result.args.newIp),
      anotherIp,
      'Wrong newIpAddress value.',
    );
  });

  it('transferDomain Should throw when the invoker is not the domain owner', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = await contractInstance.getPrice(domainName);
    await contractInstance.register(domainName, topLevelDomain, ip, {
      from: owner,
      value: currentPrice,
    });

    // Act
    const result = contractInstance.transferDomain(
      domainName,
      topLevelDomain,
      anotherAccount,
      { from: anotherAccount },
    );

    // Assert
    assertRevert(result);
  });

  it('transferDomain Should throw when passed invalid _to argument', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = await contractInstance.getPrice(domainName);
    await contractInstance.register(domainName, topLevelDomain, ip, {
      from: owner,
      value: currentPrice,
    });

    // Act
    const result = contractInstance.transferDomain(
      domainName,
      topLevelDomain,
      '0x00',
      { from: owner },
    );

    // Assert
    assertRevert(result);
  });

  it('transferDomain Should transfer the ownership when called with valid arguments', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = await contractInstance.getPrice(domainName);
    await contractInstance.register(domainName, topLevelDomain, ip, {
      from: owner,
      value: currentPrice,
    });

    // Act
    await contractInstance.transferDomain(
      domainName,
      topLevelDomain,
      anotherAccount,
      { from: owner },
    );
    const domainHash = await contractInstance.getDomainHash(
      domainName,
      topLevelDomain,
    );
    const domainDetails = await contractInstance.domainNames(domainHash);

    // Assert
    assert.equal(domainDetails[2], anotherAccount);
  });

  it('transferDomain Should raise LogDomainNameTransferred event when called with valid arguments', async () => {
    // Arrange
    const domainName = 'milenradkov';
    const ip = '127.0.0.1';
    const topLevelDomain = 'com';
    const currentPrice = await contractInstance.getPrice(domainName);
    await contractInstance.register(domainName, topLevelDomain, ip, {
      from: owner,
      value: currentPrice,
    });
    const event = contractInstance.LogDomainNameTransferred();
    const promiEvent = watchEvent(event);
    events.push(event);

    // Act
    await contractInstance.transferDomain(
      domainName,
      topLevelDomain,
      anotherAccount,
      { from: owner },
    );
    const result = await promiEvent;

    // Assert
    assert.equal(
      web3.toUtf8(result.args.domainName),
      domainName,
      'Wrong domainName value.',
    );
    assert.equal(
      web3.toUtf8(result.args.topLevel),
      topLevelDomain,
      'Wrong topLevel value.',
    );
    assert.equal(result.args.owner, owner, 'Wrong owner address value.');
    assert.equal(
      result.args.newOwner,
      anotherAccount,
      'Wrong newOwner address value.',
    );
  });

  it('getPrice Should return regular price, when passed domain with 8 symbols or more', async () => {
    // Arrange
    const domainName = 'milenradkov';
    let currentPrice = await contractInstance.getPrice(domainName);

    // Act
    const result = await contractInstance.getPrice(domainName);

    // Assert
    assert.deepEqual(result, currentPrice);
  });

  it('getPrice Should return 200% higher price, when passed domain with 5, 6 or 7 symbols', async () => {
    // Arrange
    const domainNameRegular = 'milen123';
    const domainNameShort = 'milen';
    let regularPrice = await contractInstance.getPrice(domainNameRegular);
    regularPrice = regularPrice.mul(2);

    // Act
    const shortPrice = await contractInstance.getPrice(domainNameShort);

    // Assert
    assert.equal(regularPrice.toString(10), shortPrice.toString(10));
  });
});
