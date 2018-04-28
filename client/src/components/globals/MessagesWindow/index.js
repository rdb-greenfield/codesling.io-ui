import React, { Component } from "react";
import "./MessagesWindow.css";

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: this.props.messages
    };
  }
  getDerivedStateFromProps(nextProps, prevState) {
    console.log("next", nextProps);
    if (nextProps.messages.lenghth > this.state.messages.length) {
      this.setState({
        messages: nextProps.messages
      });
    }
  }
  render() {
    return (
      <div className="messages-container">
        {this.props.messages.map(message => {
          const id = localStorage.getItem("id");
          if (message.sender_id == id) {
            return (
              <div className="message-container" key={message.id}>
                <div className="my-message">{message.content}</div>{" "}
              </div>
            );
          } else {
            return (
              <div className="message-container" key={message.id}>
                <div className="other-message">{message.content}</div>
              </div>
            );
          }
        })}
      </div>
    );
  }
}
