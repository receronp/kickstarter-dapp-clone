import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function ContractBtns({ setManager, setValue, setRequests }) {
  const {
    state: { contract, accounts },
  } = useEth();
  const [contributeValue, setContributeValue] = useState("");
  const [finalizeValue, setFinalizeValue] = useState("");

  const handleContributeChange = (e) => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setContributeValue(e.target.value);
    }
  };

  const handleFinalizeChange = (e) => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setFinalizeValue(e.target.value);
    }
  };

  const manager = async () => {
    const value = await contract.methods.manager().call({ from: accounts[0] });
    setManager(value);
  };

  const minimumContribution = async () => {
    const value = await contract.methods
      .minimumContribution()
      .call({ from: accounts[0] });
    setValue(value);
  };

  const requests = async () => {
    const count = await contract.methods
      .numRequests()
      .call({ from: accounts[0] });

    const requestList = [];
    for (let ii = 0; ii < count; ii++) {
      requestList.push(
        await contract.methods.requests(ii).call({ from: accounts[0] })
      );
    }

    setRequests(requestList);
  };

  const contribute = async (e) => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (contributeValue === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newValue = parseInt(contributeValue);
    await contract.methods
      .contribute()
      .send({ from: accounts[0], value: newValue });
  };

  const finalizeRequest = async (e) => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (finalizeValue === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newValue = parseInt(finalizeValue);
    await contract.methods
      .finalizeRequest(newValue)
      .send({ from: accounts[0] });
  };

  return (
    <div className="btns">
      <button onClick={manager}>manager()</button>
      <button onClick={minimumContribution}>minimumContribution()</button>
      <button onClick={requests}>requests()</button>

      <div onClick={contribute} className="input-btn">
        contribute(
        <input
          type="text"
          placeholder="uint"
          value={contributeValue}
          onChange={handleContributeChange}
        />
        )
      </div>

      <div onClick={finalizeRequest} className="input-btn">
        finalizeRequest(
        <input
          type="text"
          placeholder="uint"
          value={finalizeValue}
          onChange={handleFinalizeChange}
        />
        )
      </div>
    </div>
  );
}

export default ContractBtns;
