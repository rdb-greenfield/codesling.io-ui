import React from "react";

import "./Input.css";

const Input = ({ type, name, onChange, placeholder, value, onKeyPress }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onKeyPress={onKeyPress}
    />
  );
};

export default Input;
