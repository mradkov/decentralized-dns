const SafeMath = artifacts.require("../contracts/libs/SafeMath.sol");
const Ownable = artifacts.require("../contracts/common/Ownable.sol");
const DDNSService = artifacts.require("../contracts/DDNSService.sol");
module.exports = (deployer) => {
   //deploy

    deployer.deploy(SafeMath);
    deployer.deploy(Ownable);

    deployer.link(SafeMath, DDNSService);
    deployer.link(Ownable, DDNSService);
    deployer.deploy(DDNSService);

};