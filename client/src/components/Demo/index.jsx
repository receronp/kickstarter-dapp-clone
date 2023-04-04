import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Cta from "./Cta";
import Contract from "./Contract";
import ContractBtns from "./ContractBtns";
import Desc from "./Desc";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Demo() {
  const { state } = useEth();
  const [manager, setManager] = useState("?");
  const [value, setValue] = useState("?");
  const [requests, setRequests] = useState([]);

  const demo = (
    <>
      <Cta />
      <div className="contract-container">
        <Contract manager={manager} value={value} requests={requests} />
        <ContractBtns
          setManager={setManager}
          setValue={setValue}
          setRequests={setRequests}
        />
      </div>
      <Desc />
    </>
  );

  return (
    <div className="demo">
      <Title />
      {!state.artifact ? (
        <NoticeNoArtifact />
      ) : !state.contract ? (
        <NoticeWrongNetwork />
      ) : (
        demo
      )}
    </div>
  );
}

export default Demo;
