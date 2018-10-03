import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Box.css";

export const constants = {
  "BOMB": "-"
};

export default class Box extends Component {
  render() {
    return (
      <button className="grid-item">{this.props.state === 0 ? "" : this.props.state}</button>
    );
  }
}

Box.propTypes = {
  state: PropTypes.any.isRequired,
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
};
