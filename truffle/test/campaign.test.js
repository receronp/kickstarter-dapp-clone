const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const { interface, bytecode } = require("../compile");

const web3 = new Web3(ganache.provider({ logging: { quiet: true } }));

let accounts;
let campaign;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract.
  campaign = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode, arguments: [100] })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Campaign", () => {
  it("should read initial constructor values", async () => {
    let value = await campaign.methods.minimumContribution().call();
    assert.equal(value, 100, "100 wasn't set as the minimum contribution");

    value = await campaign.methods.approversCount().call();
    assert.equal(value, 0, "0 was not the initial approvers count");

    value = await campaign.methods.numRequests().call();
    assert.equal(value, 0, "0 was not the initial number of requests");
  });

  it("should read additional contributor", async () => {
    let value = await campaign.methods.approversCount().call();
    assert.equal(value, 0, "0 was not the initial approvers count");

    await campaign.methods.contribute().send({ from: accounts[0], value: 101 });

    value = await campaign.methods.approversCount().call();
    assert.equal(value, 1, "contributor was not added to approvers count");
  });

  it("should read additional request", async () => {
    let value = await campaign.methods.numRequests().call();
    assert.equal(value, 0, "0 was not the initial number of requests");

    await campaign.methods
      .createRequest("Test description 1", 1000, accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    value = await campaign.methods.numRequests().call();
    assert.equal(value, 1, "request was not added to number of requests");
  });

  it("should finalize request with one approval", async () => {
    let value = await campaign.methods.numRequests().call();
    assert.equal(value, 0, "0 was not the initial number of requests");

    await campaign.methods.contribute().send({ from: accounts[0], value: 101 });
    await campaign.methods
      .createRequest("Test description 1", 100, accounts[1])
      .send({ from: accounts[0], gas: "1000000" });
    await campaign.methods.approveRequest(0).send({ from: accounts[0] });

    value = await campaign.methods.requests(0).call();
    assert.equal(
      value.approvalCount,
      1,
      "request was not added to number of requests"
    );

    await campaign.methods.finalizeRequest(0).send({ from: accounts[0] });
    value = await campaign.methods.requests(0).call();
    assert.equal(value.complete, true, "request was not finalized");
  });
});
