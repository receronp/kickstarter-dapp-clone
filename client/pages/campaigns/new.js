import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";

import Layout from "../../components/Layout";
import factory from "../../../truffle/factory";
import web3 from "../../../truffle/web3";

export default function CampaginNew() {
  const router = useRouter();

  const [state, setState] = useState({
    minimumContribution: "",
    errorMessage: "",
    loading: false,
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    setState((prevState) => {
      return { ...prevState, loading: true, errorMessage: "" };
    });

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(state.minimumContribution)
        .send({ from: accounts[0] });
      router.push("/");
    } catch (error) {
      setState((prevState) => {
        return { ...prevState, errorMessage: error.message };
      });
    }

    setState((prevState) => {
      return { ...prevState, loading: false };
    });
  };

  return (
    <Layout>
      <h2>Create a Campaign!</h2>
      <Form onSubmit={onSubmit} error={!!state.errorMessage}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={state.minimumContribution}
            onChange={(event) =>
              setState((prevState) => {
                return {
                  ...prevState,
                  minimumContribution: event.target.value,
                };
              })
            }
          />
        </Form.Field>
        <Message error header="Oops!" content={state.errorMessage} />
        <Button primary loading={state.loading} disabled={state.loading}>
          Create!
        </Button>
      </Form>
    </Layout>
  );
}
