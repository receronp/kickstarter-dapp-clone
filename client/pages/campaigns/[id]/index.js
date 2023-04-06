import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import Campaign from "../../../../truffle/Campaign";
import { Button, Card, Grid } from "semantic-ui-react";
import web3 from "../../../../truffle/web3";
import ContributeForm from "../../../components/ContributeForm";
import Link from "next/link";

function CampaignShow(summary) {
  const router = useRouter();
  const id = router.query.id;

  const renderCards = () => {
    const items = [
      {
        header: summary.manager,
        meta: "Address of manager",
        description:
          "The manager created this campaign and can withdraw money.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: summary.minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver.",
      },
      {
        header: summary.requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by approvers.",
      },
      {
        header: summary.approversCount,
        meta: "Number of Approvers",
        description:
          "Number of people who have already donated to this campaign.",
      },
      {
        header: web3.utils.fromWei(summary.balance, "ether"),
        meta: "Campaign Balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend.",
      },
    ];

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h3>Campaign {id}</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCards()}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={id} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${id}/requests`}>
              <Button primary>View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
}

CampaignShow.getInitialProps = async ({ query }) => {
  const { id } = query;
  const campaign = await Campaign(id);
  const summary = await campaign.methods.getSummary().call();
  return {
    minimumContribution: summary[0],
    balance: summary[1],
    requestsCount: summary[2],
    approversCount: summary[3],
    manager: summary[4],
  };
};

export default CampaignShow;
