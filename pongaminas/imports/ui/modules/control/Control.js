import React from "react";
import PropTypes from "prop-types";
import "./control.css";

export default class Control extends React.Component {

  render() {
    let status = (
      <div>
        <div>
          <span>{"Session: "}</span>
          <span className="dashboard-item">1234</span>
        </div>
        <div>
          <span>{"Time: "}</span>
          <span className="dashboard-item">05:00</span>
        </div>
        <div>
          <span>{"Bombs: "}</span>
          <span className="dashboard-item">2/3</span>
        </div>
      </div>
    );

    let bar = (
      <span>...</span>
    );
    if ( this.props.onGame ) {
      bar = (
        <div id="race-status-container">
          <i className="fas fa-circle"/>
          <button className="control-btn"><i className="fas fa-comments"/></button>
        </div>
      );
    }

    return (
      <div id="control">
        <div id="control-container">
          <div id="dashboard">
            <span>Buscaminas</span>
            {this.props.onGame && status}
          </div>
        </div>
        <div id="status">
          {bar}
        </div>
      </div>
    );
  }
}

Control.propTypes = {
  onGame: PropTypes.bool.isRequired
};
