import React, { useState } from "react";
import Layout from "../../../../components/Layout";
import { useRouter } from "next/router";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../../../../../truffle/Campaign";
import web3 from "../../../../../truffle/web3";
import Link from "next/link";

export default () => {
  const router = useRouter();
  const id = router.query.id;

  const [state, setState] = useState({
    description: "",
    value: "",
    recipient: "",
    loading: false,
    errorMessage: "",
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    const campaign = await Campaign(id);
    const { description, value, recipient } = state;

    setState((prevState) => {
      return { ...prevState, loading: true, errorMessage: "" };
    });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] });
      router.push(`/campaigns/${id}/requests`);
    } catch (error) {
      setState((prevState) => {
        return { ...prevState, errorMessage: error.message };
      });
    }

    setState((prevState) => {
      return {
        ...prevState,
        loading: false,
        description: "",
        value: "",
        recipient: "",
      };
    });
  };

  return (
    <Layout>
      <Link href={`/campaigns/${id}/requests`}>Back</Link>
      <h3>New Request</h3>
      <Form onSubmit={onSubmit} error={!!state.errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={state.description}
            onChange={(event) =>
              setState((prevState) => {
                return { ...prevState, description: event.target.value };
              })
            }
          ></Input>
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={state.value}
            onChange={(event) =>
              setState((prevState) => {
                return { ...prevState, value: event.target.value };
              })
            }
          ></Input>
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={state.recipient}
            onChange={(event) =>
              setState((prevState) => {
                return { ...prevState, recipient: event.target.value };
              })
            }
          ></Input>
        </Form.Field>
        <Message error header="Oops!" content={state.errorMessage} />
        <Button primary loading={state.loading} disabled={state.loading}>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};
