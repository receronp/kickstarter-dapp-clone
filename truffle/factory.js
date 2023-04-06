import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0xA35198AFbDCb7218e0eA61bFD53DCd0546F3242B"
);

export default instance;
