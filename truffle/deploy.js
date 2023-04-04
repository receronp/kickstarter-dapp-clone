require("dotenv").config();
const { INFURA_API_KEY, MNEMONIC } = process.env;
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const {
  CampaignFactory: compiledFactory,
} = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  MNEMONIC,
  `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(`Attempting to deploy from account ${accounts[0]}`);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: await web3.eth.estimateGas({
        data: compiledFactory.evm.bytecode.object,
      }),
    });

  console.log(`Contract deployed to ${result.options.address}`);
  provider.engine.stop();
};

deploy();
