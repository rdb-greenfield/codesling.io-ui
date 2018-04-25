import React from "react";

import "./Input.css";

const Input = ({ type, name, onChange, placeholder }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;
