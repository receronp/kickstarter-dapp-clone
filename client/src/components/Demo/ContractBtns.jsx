import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function ContractBtns({ setManager, setValue }) {
  const {
    state: { contract, accounts },
  } = useEth();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
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

  const contribute = async (e) => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputValue === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newValue = parseInt(inputValue);
    await contract.methods
      .contribute()
      .send({ from: accounts[0], value: newValue });
  };

  return (
    <div className="btns">
      <button onClick={manager}>manager()</button>
      <button onClick={minimumContribution}>minimumContribution()</button>

      <div onClick={contribute} className="input-btn">
        contribute(
        <input
          type="text"
          placeholder="uint"
          value={inputValue}
          onChange={handleInputChange}
        />
        )
      </div>
    </div>
  );
}

export default ContractBtns;
