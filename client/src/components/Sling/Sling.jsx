import React, { Component } from "react";
import CodeMirror from "react-codemirror2";
import io from "socket.io-client/dist/socket.io.js";
import axios from "axios";
import { throttle } from "lodash";

import Stdout from "./StdOut/index.jsx";
import EditorHeader from "./EditorHeader";
import Button from "../globals/Button";
import Timer from "../globals/Timer";
import WaitingMessage from "../globals/WaitingMessage";
import WinnerPopup from "../globals/WinnerPopup";
import Input from "../globals/forms/Input";
import Messages from "../globals/MessagesWindow";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/base16-dark.css";
import "./Sling.css";

class Sling extends Component {
  state = {
    id: null,
    ownerText: null,
    challengerText: null,
    text: "",
    challenge: "",
    stdout: "",
    player1Solution: "",
    player2Solution: "",
    winnerMessage: "",
    messageDraft: "",
    messages: [],
    startTimer: false,
    showContent: "none"
  };

  componentDidMount() {
    const { socket, challenge, player } = this.props;
    const startChall =
      typeof challenge === "string" ? JSON.parse(challenge) : {};
    socket.on("connect", () => {
      socket.emit("client.ready", {
        challenge: startChall,
        player,
        playerID: localStorage.getItem("id")
      });
    });

    socket.on("start.timer", ({ start }) => {
      this.setState({
        startTimer: start,
        showContent: "inherit"
      });
    });

    socket.on(
      "server.initialState",
      ({ id, playerOneText, playerTwoText, challenge }) => {
        this.setState({
          id,
          challenge
        });
        let startingText = `function ${this.state.challenge.fn_name}() {
  //write code here;
}`;
        this.setState({
          ownerText: startingText,
          challengerText: startingText
        });
      }
    );
    socket.on("serverOne.changed", ({ text, player }) => {
      this.setState({ ownerText: text });
    });

    socket.on("serverTwo.changed", ({ text, player }) => {
      this.setState({ challengerText: text });
    });

    socket.on("server.run", ({ stdout, player }) => {
      this.props.player === player ? this.setState({ stdout }) : null;
      if (stdout.result === "GAME OVER!") {
        // run some function to show a pop up of winner and log history to db
        let message = "Player " + player + " Wins!";
        this.setState({ winnerMessage: message });
      }
    });
    socket.on("server.message", message => {
      this.setState({
        messages: this.state.messages.concat(message)
      });
    });
    window.addEventListener("resize", this.setEditorSize);
  }

  submitCode = () => {
    const { socket, player } = this.props;
    const { ownerText, challengerText } = this.state;
    if (player === 1) {
      socket.emit("client.run", {
        text: ownerText,
        player,
        tests: JSON.parse(this.props.challenge).tests,
        fnName: JSON.parse(this.props.challenge).fn_name
      });
    } else {
      socket.emit("client.run", {
        text: challengerText,
        player,
        tests: this.state.challenge.tests,
        fnName: this.state.challenge.fn_name
      });
    }
  };

  sendMessage = (e, sender) => {
    e.preventDefault();
    const { socket, player } = this.props;
    const { messageDraft } = this.state;
    socket.emit("client.message", {
      content: messageDraft,
      sender: sender
    });
    this.setState({
      messageDraft: ""
    });
  };

  handleChange = throttle((editor, metadata, value) => {
    const { player } = this.props;
    player === 1
      ? this.setState({ player1Solution: value })
      : this.setState({ player2Solution: value });
    player === 1
      ? this.props.socket.emit("clientOne.update", { text: value, player })
      : this.props.socket.emit("clientTwo.update", { text: value, player });
  }, 250);

  setEditorSize = throttle(() => {
    this.editor.setSize(null, `${window.innerHeight - 80}px`);
  }, 100);

  initializeEditor = editor => {
    this.editor = editor;
    this.setEditorSize();
  };

  handleMessageEntry = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { socket, player } = this.props;
    if (player === 1) {
      return (
        <div className="sling-container">
          <EditorHeader props={this.props.data} />
          <div className="code1-editor-container">
            <CodeMirror
              editorDidMount={this.initializeEditor}
              value={this.state.ownerText}
              options={{
                mode: "javascript",
                lineNumbers: true,
                theme: "base16-dark"
              }}
              onChange={this.handleChange}
            />
          </div>
          <div className="stdout-container">
            <div className="title">
              {this.state.challenge.title || this.props.challenge.title}
            </div>
            <br />

            <div
              className="content"
              style={{ display: this.state.showContent }}
            >
              {this.state.challenge.content || this.props.challenge.content}
            </div>
            {this.state.startTimer ? (
              <Timer start={Date.now()} />
            ) : (
              <WaitingMessage />
            )}
            <Stdout text={this.state.stdout} />
            {this.state.winnerMessage ? (
              <WinnerPopup
                message={this.state.winnerMessage}
                data={this.props}
                challenge={this.state.challenge}
              />
            ) : null}
            <Button
              className="run-btn"
              text="Run Code"
              backgroundColor="red"
              color="white"
              onClick={() => this.submitCode()}
            />
            <div style={{ margin: "10px", paddingTop: "10px" }}>
              <Messages messages={this.state.messages} />
              <Input
                name="messageDraft"
                type="messageDraft"
                value={this.state.messageDraft}
                placeholder={"Send Message"}
                onChange={this.handleMessageEntry}
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    this.sendMessage(event, 1);
                  }
                }}
              />
            </div>
            <Button
              className="run-btn"
              text="Send Message"
              backgroundColor="red"
              color="white"
              onClick={e => this.sendMessage(e, 1)}
            />
          </div>
          <div className="code2-editor-container">
            <CodeMirror
              editorDidMount={this.initializeEditor}
              value={this.state.challengerText}
              options={{
                mode: "javascript",
                lineNumbers: true,
                theme: "base16-dark",
                readOnly: true
              }}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="sling-container">
          <EditorHeader props={this.props.data} />
          <div className="code1-editor-container">
            <CodeMirror
              editorDidMount={this.initializeEditor}
              value={this.state.ownerText}
              options={{
                mode: "javascript",
                lineNumbers: true,
                theme: "base16-dark",
                readOnly: true
              }}
            />
          </div>
          <div className="stdout-container">
            <div className="title">
              {this.state.challenge.title || this.props.challenge.title}
            </div>
            <br />
            <div className="content">
              {this.state.challenge.content || this.props.challenge.content}
            </div>
            <div>
              {this.state.startTimer ? <Timer start={Date.now()} /> : null}
            </div>
            <Stdout text={this.state.stdout} />
            {this.state.winnerMessage ? (
              <WinnerPopup
                message={this.state.winnerMessage}
                data={this.props}
                challenge={this.state.challenge}
              />
            ) : null}
            <Button
              className="run-btn"
              text="Run Code"
              backgroundColor="red"
              color="white"
              onClick={() => this.submitCode()}
            />
            <div style={{ margin: "10px", paddingTop: "10px" }}>
              <Messages messages={this.state.messages} />
              <Input
                name="messageDraft"
                type="messageDraft"
                value={this.state.messageDraft}
                placeholder={"Send Message"}
                onChange={e => {
                  this.handleMessageEntry(e);
                }}
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    this.sendMessage(event, 2);
                  }
                }}
              />
            </div>
            <Button
              className="run-btn"
              text="Send Message"
              backgroundColor="red"
              color="white"
              onClick={e => this.sendMessage(e, 2)}
            />
          </div>
          <div className="code2-editor-container">
            <CodeMirror
              editorDidMount={this.initializeEditor}
              value={this.state.challengerText}
              options={{
                mode: "javascript",
                lineNumbers: true,
                theme: "base16-dark"
              }}
              onChange={this.handleChange}
            />
          </div>
        </div>
      );
    }
  }
}

export default Sling;
