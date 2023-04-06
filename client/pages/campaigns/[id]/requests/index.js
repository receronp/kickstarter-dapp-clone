import React from "react";
import Layout from "../../../../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../../../../../truffle/Campaign";
import RequestRow from "../../../../components/RequestRow";

function RequestIndex({ requests, approversCount }) {
  const router = useRouter();
  const address = router.query.id;
  const { Header, Row, HeaderCell, Body } = Table;

  const renderRows = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          request={request}
          id={index}
          approversCount={approversCount}
          address={address}
        />
      );
    });
  };
  return (
    <Layout>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <Button primary floated="right" style={{ marginBottom: 10 }}>
          New Request
        </Button>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requests.length} requests</div>
    </Layout>
  );
}

RequestIndex.getInitialProps = async ({ query }) => {
  const { id } = query;
  const campaign = await Campaign(id);
  const numRequests = await campaign.methods.numRequests().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(numRequests))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  return { requests, approversCount };
};

export default RequestIndex;
