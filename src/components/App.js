import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Web3 from "web3";
import DaiToken from "../abis/DaiToken.json";
import SanflowToken from "../abis/SanflowToken.json";
import TokenFarm from '../abis/TokenFarm.json'
import Main from './Main';

// https://www.youtube.com/watch?v=CgXQC4dbGUE&ab_channel=DappUniversity
// 1:50:53

const App = () => {
  const [state, setState] = useState({
    account: "0x0",
    daiToken: {},
    sanflowToken: {},
    tokenFarm: {},
    daiTokenBalance: '0',
    sanflowTokenBalance: '0',
    stakingBalance: '0',
  });
  const [loading, setLoading] = useState(true);
  const [newTX, setNewTX] = useState(false)
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    if(web3){
      getAccounts()
    }
  },[web3])

  useEffect(() => {
    if (state.account !== '0x0') {
      console.log(state.account)
      loadBlockChainData();
    }
  }, [state.account]);

  useEffect(() => {
    if(newTX){
      hydrateBalances()
    }
  },[newTX])

  const getAccounts = async () => {
    const accounts = await web3.eth.getAccounts();

    let copyOfState = { ...state };
    copyOfState.account = accounts[0];
    setState(copyOfState);
  }

  const loadBlockChainData = async () => {

    let copyOfState = {...state};

    // Get networkId for our deployed smart contract
    const networkId = await web3.eth.net.getId();

    // Grab daiTokens data (address, etc..)
    const daiTokenData = DaiToken.networks[networkId];

    if (daiTokenData) {
      let daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
      copyOfState.daiToken = daiToken;

      // grab balance
      let daiTokenBalance = await daiToken.methods.balanceOf(state.account).call();
      copyOfState.daiTokenBalance = daiTokenBalance.toString();
    } else {
      window.alert(`DaiToken contract not deployed to detected network`);
    }

    // Grab daiTokens data (address, etc..)
    const sanflowTokenData = SanflowToken.networks[networkId];

    if (sanflowTokenData) {
      let sanflowToken = new web3.eth.Contract(SanflowToken.abi,sanflowTokenData.address);
      copyOfState.sanflowToken = sanflowToken;

      // grab balance
      let sanflowTokenBalance = await sanflowToken.methods.balanceOf(state.account).call();
      copyOfState.sanflowTokenBalance = sanflowTokenBalance.toString();
    } else {
      window.alert(`DaiToken contract not deployed to detected network`);
    }

    // Grab daiTokens data (address, etc..)
    const tokenFarmData = TokenFarm.networks[networkId];

    if (tokenFarmData) {
      let tokenFarm = new web3.eth.Contract(TokenFarm.abi,tokenFarmData.address);
      copyOfState.tokenFarm = tokenFarm;

      // grab balance
      let stakingBalance = await tokenFarm.methods.stakingBalance(state.account).call();
      copyOfState.stakingBalance = stakingBalance.toString();
    } else {
      window.alert(`DaiToken contract not deployed to detected network`);
    }    

    setState(copyOfState);
    setLoading(false)
  };

  const loadWeb3 = async () => {
    // if ethereum object exists
    let web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      window.web3 = web3;
      setWeb3(web3);
      await window.ethereum.enable();
      // if web3 object exists
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
      window.web3 = web3;
      setWeb3(web3);
    }
    // we don't have either
    else {
      window.alert(
        `Non-Ethereum browser detected. You should consider trying Metamask!`
      );
    }
  };

  const hydrateBalances = async () => {
    let copyOfState = {...state}
    
    // grab token farm balance from user
    let stakingBalance = await state.tokenFarm.methods.stakingBalance(state.account).call();
    copyOfState.stakingBalance = stakingBalance.toString();

    // grab sanflow balance from user
    let sanflowTokenBalance = await state.sanflowToken.methods.balanceOf(state.account).call();
    copyOfState.sanflowTokenBalance = sanflowTokenBalance.toString();

    // grab daiToken balance from user
    let daiTokenBalance = await state.daiToken.methods.balanceOf(state.account).call();
    copyOfState.daiTokenBalance = daiTokenBalance.toString();

    setState({...copyOfState})
    setNewTX(false)
    setLoading(false)
  }
 
  const stakeTokens = (amount) => {
    setLoading(true)

    let validTX = false;

    state.daiToken.methods.approve(state.tokenFarm._address, amount).send({from: state.account}).on('transactionHash', (hash) => {
      state.tokenFarm.methods.stakeTokens(amount).send({from: state.account}).on('transactionHash', (hash) => {
        validTX = true;
        if(validTX && hash){
          setNewTX()
        }
      })
    })
    if(!validTX){
      setLoading(false)
    }
  }

  const unstakeTokens = (amount) => {
    setLoading(true)
    state.tokenFarm.methods.unstakeTokens().send({from: state.account}).on('transactionHash', (hash) => {
      setLoading(false)
    })
  }

  return (
    <div>
      <Navbar account={state.account} />
      <div className="container-fluid mt-5">
        {loading ? <p id='loader' className='text-center'>Loading...</p> : 
        <Main 
          sanflowTokenBalance={state.sanflowTokenBalance}
          daiTokenBalance={state.daiTokenBalance}
          stakingBalance={state.stakingBalance}
          stakeTokens={stakeTokens}
          unstakeTokens={unstakeTokens}
        />
        }
      </div>
    </div>
  );
};

export default App;
