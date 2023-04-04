const Campaign = artifacts.require("Campaign");

contract("Campaign", (accounts) => {
  let campaign;

  it("should read initial constructor values", async () => {
    campaign = await Campaign.deployed();

    var value = await campaign.minimumContribution();
    assert.equal(value, 100, "100 wasn't set as the minimum contribution");

    var value = await campaign.approversCount();
    assert.equal(value, 0, "0 was not the initial approvers count");

    var value = await campaign.numRequests();
    assert.equal(value, 0, "0 was not the initial number of requests");
  });

  it("should read additional contributor", async () => {
    campaign = await Campaign.deployed();

    let value = await campaign.approversCount();
    assert.equal(value, 0, "0 was not the initial approvers count");

    await campaign.contribute({ from: accounts[0], value: 101 });

    value = await campaign.approversCount();
    assert.equal(value, 1, "contributor was not added to approvers count");
  });

  it("should read additional request", async () => {
    campaign = await Campaign.deployed();

    let value = await campaign.numRequests();
    assert.equal(value, 0, "0 was not the initial number of requests");

    await campaign.createRequest("Test description 1", 100, accounts[1], {
      from: accounts[0],
      gas: "1000000",
    });

    value = await campaign.numRequests();
    assert.equal(value, 1, "request was not added to number of requests");
  });

  it("should finalize request with one approval", async () => {
    campaign = await Campaign.deployed();

    await campaign.approveRequest(0, { from: accounts[0] });

    value = await campaign.requests(0);
    assert.equal(
      value.approvalCount,
      1,
      "request was not added to number of requests"
    );

    await campaign.finalizeRequest(0, { from: accounts[0] });
    value = await campaign.requests(0);
    assert.equal(value.complete, true, "request was not finalized");
  });
});
