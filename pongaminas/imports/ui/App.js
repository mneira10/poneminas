import React, { Component } from "react";
import "./App.css";
// import Board from "./modules/board/Board";
// import Control from "./modules/control/Control";
// import Welcome from "./modules/welcome/Welcome";
import { withTracker } from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";
import AccountsUIWrapper from "./AccountsUIWrapper.js";
import PropTypes from "prop-types";
import Session from "./modules/session/Session";


class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      onGame: false
    };
    this.onLogin = this.onLogin.bind( this );
  }

  onLogin() {
    this.setState( { onGame: true } );
  }

  render() {
    return (
      <div className="App">
        <div className="signIn">
          <AccountsUIWrapper/>
        </div>
        <div className="container">
          {this.props.currentUser ? 
            <Session/>:
            <div className="welcome">
              <i className="fas fa-bomb"/> 
              <h1>Welcome to <b>Pongaminas</b></h1> 
              <h3>Please sign in to play</h3>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user(),
  };
})(App);


App.propTypes = {
  currentUser : PropTypes.object,
};
