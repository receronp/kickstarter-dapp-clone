import { useRef, useEffect } from "react";

function Contract({ manager, value }) {
  const spanEle = useRef(null);

  useEffect(() => {
    spanEle.current.classList.add("flash");
    const flash = setTimeout(() => {
      spanEle.current.classList.remove("flash");
    }, 300);
    return () => {
      clearTimeout(flash);
    };
  }, [value]);

  return (
    <code>
      {`contract Campaign {
    address public manager; // set to `}
      <span className="secondary-color" ref={spanEle}>
        <strong>{manager}</strong>
      </span>
      {`
    uint public minimumContribution; // set to `}
      <span className="secondary-color" ref={spanEle}>
        <strong>{value}</strong>
      </span>
      {`
    address[] public approvers;

    constructor(uint minimum) {
        manager = msg.sender;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers.push(msg.sender);
    }
}`}
    </code>
  );
}

export default Contract;
