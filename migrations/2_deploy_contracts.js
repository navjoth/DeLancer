const HireChain = artifacts.require("HireChain");

module.exports = async function (deployer) {
  // Deploy HireChain
  await deployer.deploy(HireChain);
};