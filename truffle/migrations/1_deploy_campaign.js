const CampaignFactory = artifacts.require("CampaignFactory");
const Campaign = artifacts.require("Campaign");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(CampaignFactory);
  deployer.deploy(Campaign, 100, accounts[0]);
};
