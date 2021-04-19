pragma solidity ^0.5.16;

import "./SanflowToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Token Farm";
    SanflowToken public sanflowToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;


    constructor(SanflowToken _sanflowToken, DaiToken _daiToken) public{
        sanflowToken = _sanflowToken;
        daiToken = _daiToken;
    }

    // 1. Staking Tokens (Deposit)
    function stakeTokens(uint _amount) public {
        
        // Transfer Dai Tokens from investor to farm for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array * only if they haven't staked already
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        // update Staking status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // 2. Unstaking Tokens (Withdraw)

    // 3. Issuing Tokens 
}
