import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0xD3dc0F6bA2332490ef3144720D9d158Bb9dC5F20"
);

export default instance;
