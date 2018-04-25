import React, { Component } from "react";
import axios from "axios";

import Input from "../../globals/forms/Input";
import Button from "../../globals/Button/";
import Logo from "../../globals/Logo";

import "./Auth.css";

class AddChallenge extends Component {
  state = {
    title: "",
    content: "",
    tests: "",
    fn_name: "",
    difficulty: null
  };

  submitChallenge = async e => {
    e.preventDefault();
    const { title, content, difficulty, tests, fn_name } = this.state;
    const id = localStorage.getItem("id");
    const body = {
      title,
      content,
      difficulty,
      user_id: id,
      fn_name,
      type: 0
    };
    const result = await axios.post(
      "http://localhost:3396/api/challenges/addChallenge",
      body
    );
    const body2 = {
      tests: this.state.tests,
      challenge_id: result.data[0].id
    };
    const result2 = await axios.post(
      "http://localhost:3396/api/testCases/",
      body2
    );
    this.props.history.push("/home");
  };

  handleChallengeInput = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className="login-form-container">
        <Logo className="landing-page-logo" />
        <form className="auth-form">
          <Input
            name="title"
            type="title"
            placeholder={"Challenge Title"}
            onChange={this.handleChallengeInput}
          />
          <Input
            name="difficulty"
            type="difficulty"
            placeholder={"Difficulty (1-10)"}
            onChange={this.handleChallengeInput}
          />
          <Input
            name="content"
            type="description"
            placeholder={"Description"}
            onChange={this.handleChallengeInput}
          />
          <Input
            name="fn_name"
            type="fn_name"
            placeholder={"Function Name"}
            onChange={this.handleChallengeInput}
          />
          <textarea
            className="testsInput"
            name="tests"
            placeholder="Test Cases (separate input & result with newline)"
            cols="40"
            rows="5"
            onChange={this.handleChallengeInput}
          />
          <Button
            backgroundColor="red"
            color="white"
            text="Add Challenge"
            onClick={e => this.submitChallenge(e)}
          />
        </form>
      </div>
    );
  }
}

export default AddChallenge;
