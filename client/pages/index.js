import React from "react";
import Link from "next/link";
import { Button, Card } from "semantic-ui-react";

import Layout from "../components/Layout";
import factory from "../../truffle/factory";

function CampaignIndex({ campaigns }) {
  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: <Link href={`/campaigns/${address}`}>View Campaign</Link>,
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h3>Open Campaigns</h3>
      <Link href="/campaigns/new">
        <Button content="Create Campaign" icon="add" floated="right" primary />
      </Link>
      {renderCampaigns()}
    </Layout>
  );
}

CampaignIndex.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default CampaignIndex;
