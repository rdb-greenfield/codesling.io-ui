import React, { Component } from "react";
import randomstring from "randomstring";
import axios from "axios";

import Button from "../globals/Button";
import Logo from "../globals/Logo";
import EditorHeader from "../Sling/EditorHeader";

import "./LandingPage.css";

let slingId;

class Home extends Component {
  state = {
    allChallenges: [],
    selectedChallenge: {}
  };

  async componentDidMount() {
    const { data } = await axios.get(`http://localhost:3396/api/challenges`);
    this.setState({ allChallenges: data });
  }

  randomSlingId = () => {
    slingId = `${randomstring.generate()}`;
  };

  handleDuelClick = () => {
    this.randomSlingId();
    this.props.history.push({
      pathname: `/${slingId}`,
      state: {
        challenge: this.state.selectedChallenge
      }
    });
  };

  handleAddChallengeClick = () => {
    this.props.history.push("/addChallenge");
  };

  handleChallengeSelect = e => {
    e.preventDefault();
    const { value } = e.target;
    this.setState({ selectedChallenge: value });
  };

  render() {
    return (
      <div className="landing-page-container">
        <EditorHeader props={this.props} />
        <br />
        <select
          className="challenge-selector"
          onChange={e => this.handleChallengeSelect(e)}
        >
          <option>Select a Challenge</option>
          {this.state.allChallenges.map(challenge => {
            return (
              <option key={challenge.id} value={JSON.stringify(challenge)}>
                {challenge.title}
              </option>
            );
          })}
        </select>
        <br />
        <br />
        <Button
          backgroundColor="red"
          color="white"
          text="Create Challenge"
          onClick={() => this.handleAddChallengeClick()}
        />
        <br />
        <Button
          backgroundColor="red"
          color="white"
          text="Duel"
          onClick={() => this.handleDuelClick()}
        />
      </div>
    );
  }
}

export default Home;
