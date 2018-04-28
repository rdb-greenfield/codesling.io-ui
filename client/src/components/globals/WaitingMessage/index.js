import React, { Component } from "react";
import "./WaitingMessage.css";

export default class WaitingMessage extends Component {
  render() {
    return <p className="timer">Waiting for opponent...</p>;
  }
}
