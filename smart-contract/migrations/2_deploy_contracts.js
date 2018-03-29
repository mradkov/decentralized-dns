const SafeMath = artifacts.require("../contracts/libs/SafeMath.sol");
const Destructible = artifacts.require("../contracts/common/Destructible.sol");
const Ownable = artifacts.require("../contracts/common/Ownable.sol");
const DDNSService = artifacts.require("../contracts/DDNSService.sol");
module.exports = (deployer) => {
   //deploy

    deployer.deploy(SafeMath);
    deployer.deploy(Destructible);

    deployer.link(SafeMath, DDNSService);
    deployer.link(Destructible, DDNSService);
    deployer.deploy(DDNSService);

};