import Web3 from "web3";

const web3 = new Web3();

export const tokens = (n) => {
  return web3.utils.toWei(n, "ether");
};

export default {
    tokens
}
