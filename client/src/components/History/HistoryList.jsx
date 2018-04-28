import React from "react";
import "./HistoryList.css";
import EditorHeader from "../Sling/EditorHeader";

export const HistoryList = ({ history, data }) => {
  let outcome;
  return (
    <div className="history-list">
      <EditorHeader props={data} />
      <br />
      {history.map(hist => {
        outcome = hist.outcome === 0 ? "Loss" : "Win";

        return (
          <li className="list-items">
            <div className="list-item">Outcome: {outcome}</div>
            <div className="list-item">Opponent: {hist.username}</div>
            <div className="list-item">Problem Difficulty: {hist.clout}</div>
            <div className="list-item">Time: {hist.time}</div>
            <br />
          </li>
        );
      })}
    </div>
  );
};
