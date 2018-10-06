import React from "react";
import PropTypes from "prop-types";
import "./welcome.css";
// import AccountsUIWrapper from "../../AccountsUIWrapper.js";

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
        {/* <AccountsUIWrapper/> */}
        <div>
          Welcome to PongaMinas
        </div>
      </div>
    );
  }
}

Welcome.propTypes = {
  onLogin: PropTypes.func.isRequired
};
