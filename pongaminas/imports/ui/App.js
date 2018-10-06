import React, { Component } from "react";
import "./App.css";
import Board from "./modules/board/Board";
import Control from "./modules/control/Control";
import Welcome from "./modules/welcome/Welcome";


export default class App extends Component {
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
        <Control onGame={this.state.onGame}/>
        <div>
          {this.state.onGame ? <Board/> : <Welcome onLogin={this.onLogin}/>}
        </div>
      </div>
    );
  }
}


