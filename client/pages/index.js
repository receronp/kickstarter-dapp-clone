import React, { Component } from "react";
import factory from "../../truffle/factory";

class CampaignIndex extends Component {
  async componentDidMount() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    console.log(campaigns);
  }

  render() {
    return <div>Campaigns Index!</div>;
  }
}

export default CampaignIndex;
