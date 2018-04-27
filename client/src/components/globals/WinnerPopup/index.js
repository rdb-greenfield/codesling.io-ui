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
    if (challenger) {
      const result = await axios.post(
        "http://localhost:3396/api/history/addHistory",
        body
      );
    }
    props.history.push("/home");
  }

  render() {
    return (
      <div>
        <SkyLight
          afterClose={() => this.handleExit(this.props.data.data)}
          ref={ref => (this.dialogWithCallBacks = ref)}
          hideOnOverlayClicked
          transitionDuration={3000}
        >
          <h1 className="winner-popup">{this.props.message}</h1>
          <h2 className="winner-popup">Congrats!</h2>
        </SkyLight>
      </div>
    );
  }
}

WinnerPopup.displayName = "WinnerPopup";

// export const addHistoryHelper = `
//     INSERT INTO histories
//       (outcome, time, clout, user_id, challenger_id, challenge_id)
//     VALUES
//       ($1, $2, $3, $4, $5, $6)
//     RETURNING
//       id, outcome, time, clout, user_id, challenger_id, challenge_id
//   `;
