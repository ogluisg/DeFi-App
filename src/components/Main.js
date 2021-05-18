import React, { useState } from "react";
import dai from '../assets/dai.png';
import * as helper from '../helpers/helper';
import "./App.css";

const ETHER = 'Ether'

const Main = ({sanflowTokenBalance, daiTokenBalance, stakingBalance, stakeTokens, unstakeTokens}) => {
  const tokens = window.web3.utils

  const [value, setValue] = useState('0')

  const handleOnChangeValue = (event) => {
    const value = event.target.value.toString();
    setValue(value)
  }

  const handleStake = (event) => {
    event.preventDefault();
    let amount = tokens.toWei(value.toString(), ETHER);
    stakeTokens(amount);
  }

  const handleUnstake = (event) => {
    event.preventDefault();
    unstakeTokens()
  }
  return (
    <div id='content' className='mt-3'>
      <table className='table table-borderless text-muted text-center'>
        <thead>
          <tr>
            <th scope='col'>Staking Balance</th>
            <th scope='col'>Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{tokens.fromWei(stakingBalance,ETHER)} mDAI</td>
            <td>{tokens.fromWei(sanflowTokenBalance, ETHER)} SANFLOW</td>
          </tr>
        </tbody>
      </table>

      <div className='card mb-4'>
        <div className='card-body'>
          <form className='mb-3' 
            onSubmit={handleStake}
          >
            <div>
              <label className='float-left'><b>Stake Tokens</b></label>
              <span className='float-right text-muted'>
                Balance: {tokens.fromWei(daiTokenBalance, ETHER)}
              </span>
            </div>
            <div className='input-group mb-4'>
              <input
                type='number'
                className='form-control form-control-lg'
                value={value}
                onChange={handleOnChangeValue}
                required
              />
            <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dai} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; mDAI
                  </div>
                </div>
            </div>
            <button type='submit' className='btn btn-primary btn-block btn-lg'>STAKE</button>
          </form>
          <button 
            type='submit' 
            className='btn btn-danger btn-block btn-lg'
            onClick={handleUnstake}
            >
              UNSTAKE
            </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
