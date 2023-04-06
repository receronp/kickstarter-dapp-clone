import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../../truffle/Campaign";
import web3 from "../../truffle/web3";
import { useRouter } from "next/router";

const ContributeForm = ({ address }) => {
  const router = useRouter();
  const [state, setState] = useState({
    value: "",
    errorMessage: "",
    loading: false,
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    const campaign = await Campaign(address);

    setState((prevState) => {
      return { ...prevState, loading: true, errorMessage: "" };
    });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(state.value, "ether"),
      });
      router.push(`/campaigns/${address}`);
    } catch (error) {
      setState((prevState) => {
        return { ...prevState, errorMessage: error.message };
      });
    }

    setState((prevState) => {
      return { ...prevState, loading: false, value: "" };
    });
  };
  return (
    <Form onSubmit={onSubmit} error={!!state.errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          value={state.value}
          onChange={(event) =>
            setState((prevState) => {
              return { ...prevState, value: event.target.value };
            })
          }
          label="ether"
          labelPosition="right"
        />
      </Form.Field>
      <Message error header="Oops!" content={state.errorMessage} />
      <Button primary loading={state.loading} disabled={state.loading}>
        Contribute!
      </Button>
    </Form>
  );
};

export default ContributeForm;
