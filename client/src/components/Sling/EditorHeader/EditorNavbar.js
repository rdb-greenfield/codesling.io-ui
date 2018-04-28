import React, { Component } from "react";

class EditorNavbar extends Component {
  handleHomeClick() {
    this.props.props.history.push("/home");
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
          <li className="attribute">
            <span className="label">Clout: </span>
            {"  "}
            {localStorage.getItem("clout")}
          </li>
          <li className="attribute">
            <span className="label">Win Ratio:</span>
            {"  "}
            {localStorage.getItem("kdr").slice(0, 4)}
          </li>
          <li onClick={() => this.handleHomeClick()}>Home</li>
          <li onClick={() => this.handleHistoryClick()}>History</li>
          <li onClick={() => this.handleLogoutClick()}>Logout</li>
        </ul>
      </nav>
    );
  }
}

export default EditorNavbar;
