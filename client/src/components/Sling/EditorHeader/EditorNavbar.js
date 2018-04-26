import React, { Component } from "react";

class EditorNavbar extends Component {
  handleChallengesClick() {
    console.log(this.props.props.history);
  }
  handleHistoryClick() {
    this.props.props.history.push("/history");
  }
  handleLogoutClick() {
    localStorage.setItem("email", "");
    localStorage.setItem("id", "");
    localStorage.setItem("token", "");
    this.props.props.history.push("/logout");
  }
  render() {
    return (
      <nav className="editor-navbar">
        <ul>
          <li onClick={() => this.handleChallengesClick()}>Challenges</li>
          <li onClick={() => this.handleHistoryClick()}>History</li>
          <li onClick={() => this.handleLogoutClick()}>Logout</li>
        </ul>
      </nav>
    );
  }
}

export default EditorNavbar;
