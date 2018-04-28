import React, { Component } from "react";
import SkyLight from "react-skylight";
import io from "socket.io-client/dist/socket.io.js";
import axios from "axios";

import "./WinnerPopup.css";

export default class WinnerPopup extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    player1: 0,
    player2: 0
  };

  componentDidMount() {
    const socket = this.props.data.socket;
    socket.emit("game.finished");

    socket.on("server.sendPlayers", ({ player1Id, player2Id }) => {
      this.setState({
        player1: player1Id,
        player2: player2Id
      });
    });

    this.dialogWithCallBacks.show();
  }

  async handleExit(props) {
    let winner = Number(this.props.message.slice(7, 8));
    let outcome = 0;
    let challenger = 0;
    this.props.data.player === winner ? (outcome = 1) : null;
    this.props.data.player === 1
      ? (challenger = this.state.player2)
      : (challenger = this.state.player1);

    let body = {
      outcome,
      time: 0,
      clout: this.props.challenge.difficulty,
      user_id: parseInt(localStorage.getItem("id")),
      challenger_id: parseInt(challenger),
      challenge_id: this.props.challenge.challenge_id
    };

    let cloutEarned = outcome === 1 ? this.props.challenge.difficulty : 0;

    let body2 = {
      id: parseInt(localStorage.getItem("id")),
      clout: cloutEarned,
      wins: outcome
    };
    if (challenger) {
      await axios.post("http://localhost:3396/api/history/addHistory", body);
      // update clout and user table
      await axios.post("http://localhost:3396/api/users/addGame", body2);
      let data = await axios.get(
        `http://localhost:3396/api/users/${localStorage.getItem("id")}`
      );
      localStorage.setItem("kdr", data.data[0].kdr);
      localStorage.setItem("clout", data.data[0].clout);
    }
    setTimeout(function() {
      localStorage.setItem("time", 0);
      props.history.push("/home");
    }, 1000);
  }

  render() {
    return (
      <div>
        <SkyLight
          afterClose={() => this.handleExit(this.props.data.data)}
          ref={ref => (this.dialogWithCallBacks = ref)}
          hideOnOverlayClicked
          transitionDuration={1000}
        >
          <h1 className="winner-popup">{this.props.message}</h1>
          <h2 className="winner-popup">Congrats!</h2>
        </SkyLight>
      </div>
    );
  }
}

WinnerPopup.displayName = "WinnerPopup";
