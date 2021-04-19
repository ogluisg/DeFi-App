import { assert } from 'chai';
import helper from './helpers/helper';

const TokenFarm = artifacts.require("TokenFarm");
const SanflowToken = artifacts.require("SanflowToken");
const DaiToken = artifacts.require("DaiToken");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("TokenFarm", ([owner, investor]) => {
  let daiToken, sanflowToken, tokenFarm;

  before(async () => {
    // Load smart contracts
    daiToken = await DaiToken.new();
    sanflowToken = await SanflowToken.new();
    tokenFarm = await TokenFarm.new(sanflowToken.address, daiToken.address);

    // Transfer all Sanflow Tokens to farm (1 million)
    await sanflowToken.transfer(tokenFarm.address, helper.tokens("1000000"));

    // Send tokens to investor
    await daiToken.transfer(investor, helper.tokens("100"), { from: owner });
  });

  describe("Mock Dai deployment", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });

  describe("Sanflow Token deployment", async () => {
    it("has a name", async () => {
      const name = await sanflowToken.name();
      assert.equal(name, "SanflowToken");
    });
  });

  describe("Token Farm deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "Token Farm");
    });

    it('contract has tokens', async () => {
        const balance = await sanflowToken.balanceOf(tokenFarm.address);
        assert.equal(balance.toString(), helper.tokens('1000000'))
    })
  });

  describe('Staking Tokens', async () => {

    it('rewards investors for staking Sanflow Tokens', async () => {

        // Check investor balance before staking
        let result = await daiToken.balanceOf(investor);
        assert.equal(result.toString(), helper.tokens('100'), 'Investor Mock Dai Wallet balance correct before staking')

        // Approve & Stake Mock DAI Tokens
        await daiToken.approve(tokenFarm.address, helper.tokens('100'), { from: investor })
        await tokenFarm.stakeTokens(helper.tokens('100'), { from: investor})

         // Check investor wallet after staking
        result = await daiToken.balanceOf(investor);
        assert.equal(result.toString(), helper.tokens('0'), 'Investor Mock Dai wallet balance correct after staking')
              
         // Check investors wallet in the farm after staking
         result = await tokenFarm.stakingBalance(investor)
         assert.equal(result.toString(), helper.tokens('100'), 'Investor staking balance correct after staking')   
    })
  })

});
