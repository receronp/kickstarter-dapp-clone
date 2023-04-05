require("dotenv").config();
const { INFURA_API_KEY, MNEMONIC } = process.env;
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new HDWalletProvider(
    MNEMONIC,
    `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
  );

  web3 = new Web3(provider);
}

export default web3;
