import React from "react";

// import Loading from '../../globals/Loading';

const StdOut = ({ text }) => {
  return (
    <div>
      <span style={{ marginLeft: "10px" }}>Result:</span>
      <br />
      <span style={{ marginLeft: "10px" }}>{text.result}</span>
      <br />
      <br />
      <span style={{ marginLeft: "10px" }}>Console:</span>
      <br />
      <span style={{ marginLeft: "10px" }}>{text.console}</span>
    </div>
  );
};

export default StdOut;
