import React from "react";
import PropTypes from "prop-types";
import "./welcome.css";

export default class Welcome extends React.Component {
  render() {
    return (
      <div id="welcome">
        <div id="login">
          <div>
            <span>Username</span>
            <input/>
          </div>
          <div>
            <span>Password</span>
            <input type="password"/>
          </div>
          <button onClick={this.props.onLogin}>Login</button>
          <button onClick={this.props.onLogin}>Sign Up</button>
        </div>
        <div>
          Welcome to ....
        </div>
      </div>
    );
  }
}

Welcome.propTypes = {
  onLogin: PropTypes.func.isRequired
};
