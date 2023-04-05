const path = require("path");
const fs = require("fs");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
fs.rmSync(buildPath, { recursive: true, force: true });

const contractPath = path.resolve(__dirname, "contracts");
const contractFiles = fs.readdirSync(contractPath);
const sources = Object.fromEntries(
  contractFiles.map((contract) => [
    contract,
    { content: fs.readFileSync(`${contractPath}/${contract}`, "utf-8") },
  ])
);

var input = {
  language: "Solidity",
  sources: sources,
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const { contracts } = JSON.parse(solc.compile(JSON.stringify(input)));

if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath);
}

for (let contract in contracts) {
  fs.writeFileSync(
    path.resolve(buildPath, `${path.parse(contract).name}.json`),
    JSON.stringify(contracts[contract][path.parse(contract).name])
  );
}
