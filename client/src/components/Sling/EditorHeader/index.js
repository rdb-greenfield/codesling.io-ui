import React from "react";
import Logo from "../../globals/Logo";

import EditorNavbar from "./EditorNavbar";

import "./EditorHeader.css";

const EditorHeader = props => (
  <div className="editor-header">
    <div className="logo-container">
      <Logo />
    </div>
    <div className="navbar-container">
      <EditorNavbar props={props.props} />
    </div>
  </div>
);

export default EditorHeader;
