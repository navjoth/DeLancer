const ReputationToken = artifacts.require("ReputationToken");
const HireChain = artifacts.require("HireChain");

module.exports = async function (deployer) {
  // Deploy ReputationToken with an initial supply of 1,000,000 tokens
  await deployer.deploy(ReputationToken, 1000000);
  const reputationTokenInstance = await ReputationToken.deployed();

  // Deploy HireChain, passing the ReputationToken address
  await deployer.deploy(HireChain, reputationTokenInstance.address);
  const hireChainInstance = await HireChain.deployed();

  // Transfer some REP tokens to HireChain for rewards (e.g., 500,000 tokens)
  await reputationTokenInstance.transfer(hireChainInstance.address, web3.utils.toWei("500000", "ether"));
};