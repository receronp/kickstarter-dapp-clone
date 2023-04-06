const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const CampaignFactory = require("../build/CampaignFactory.json");
const Campaign = require("../build/Campaign.json");

const web3 = new Web3(ganache.provider({ logging: { quiet: true } }));

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract.
  factory = await new web3.eth.Contract(CampaignFactory.abi)
    .deploy({ data: CampaignFactory.evm.bytecode.object })
    .send({
      from: accounts[0],
      gas: await web3.eth.estimateGas({
        data: CampaignFactory.evm.bytecode.object,
      }),
    });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(Campaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and sets them as approvers", async () => {
    await campaign.methods.contribute().send({ from: accounts[1], value: 200 });
    const isContriubtor = campaign.methods.approvers(accounts[1]).call();
    assert(isContriubtor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ from: accounts[1], value: 50 });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("allows manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy batteries", request.description);
  });

  it("processes requests", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[0], value: web3.utils.toWei("10", "ether") });

    await campaign.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 1004);
  });
});
