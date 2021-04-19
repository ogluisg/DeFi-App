const TokenFarm = artifacts.require("TokenFarm");
const SanflowToken = artifacts.require('SanflowToken');
const DaiToken = artifacts.require('DaiToken')

module.exports = async function(deployer, network, accounts) {

  // Step #1: Deploy DAI token -- Investor deposits Daii
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  // Step #2: Deploy Sanflow Token --- Investor is paid in sanflow token
  await deployer.deploy(SanflowToken);
  const sanflowToken = await SanflowToken.deployed();

  // Step #3: Deploy TokenFarm -- we deploy the smart contract 
  await deployer.deploy(TokenFarm, sanflowToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  // Step #4: Transfer all tokens to TokenFarm (1 million) --
  await sanflowToken.transfer(tokenFarm.address, '1000000000000000000000000')

  // Step #5: Transfer 100 Sanflow Tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000')
};
