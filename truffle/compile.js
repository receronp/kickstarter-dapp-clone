const path = require("path");
const fs = require("fs");
const solc = require("solc");

var contractName = "Campaign";
const contractPath = path.resolve(
  __dirname,
  "contracts",
  `${contractName}.sol`
);
const source = fs.readFileSync(contractPath, "utf-8");

var input = {
  language: "Solidity",
  sources: {
    [`${contractName}.sol`]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const { contracts } = JSON.parse(solc.compile(JSON.stringify(input)));
const contract = contracts[`${contractName}.sol`][contractName];

module.exports = {
  interface: contract.abi,
  bytecode: contract.evm.bytecode.object,
};
