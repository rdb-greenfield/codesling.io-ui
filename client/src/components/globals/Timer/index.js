import React, { Component } from "react";
import "./Timer.css";
const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.seconds = 0;
    this.tick = this.tick.bind(this);
  }

  state = {
    start: 0,
    elapsed: 0
  };

  componentDidMount() {
    this.timer = setInterval(this.tick, 50);
    this.setState({ start: this.props.start });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    localStorage.setItem("time", this.seconds);
  }

  tick() {
    this.setState({ elapsed: new Date() - this.state.start });
  }

  render() {
    let elapsed = Math.round(this.state.elapsed / 100);
    this.seconds = Math.round(elapsed / 10);

    return (
      <p className="timer">
        Time elapsed -{" "}
        <b>{moment.duration(this.seconds, "seconds").format("h:mm:ss")}</b>
      </p>
    );
  }
}
