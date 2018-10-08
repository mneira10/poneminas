import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Sessions } from "../../../api/sessions";
import PropTypes from "prop-types";
import "./lobby.css";


class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {gameStart : false};
    
    this.numRowsInput  = React.createRef();
    this.numColsInput  = React.createRef();
    this.numBombsInput = React.createRef();
  }

  startGame(){
    const cols = this.numColsInput.current.value;
    const rows = this.numRowsInput.current.value;
    const bombs = this.numBombsInput.current.value ;
    if(cols <=0 || rows<=0){
      alert("Rows and columns must be positive integers >0");
    }
    else{
      if(bombs> 0.5*cols*rows){
        alert("The number of bombs must me less than half of the board");
      }
      else{
        let session = parseInt( this.props.session_id );
        if(session){
          let s = Sessions.findOne( { "id": session } );
        
          Sessions.update(
            { _id: s._id }, 
            {$set: {
              gameStart: new Date(),
              config : 
              { numCols : cols, 
                numRows : rows, 
                numBombs : bombs }}}
          );

          this.setState({gameStart:true});
        }
      }
    }
  }

  

  render() {
    return (
      <div id="lobby-container">
        <h1 id="lobby-session">Session {this.props.session.id} <button><i className="fas fa-play"/></button></h1>
        <div id="lobby-users">
          
          


          {this.props.session.gameStart === undefined?
            
            this.props.sessionType === "join" ? 
              <h1 className="Please wait">Please wait while party leader starts the game</h1>
              :
              <div className="setupGame">
                <p>Number of Rows:</p>
                <input type="number" ref={this.numRowsInput } className="numRows"/>
                <p>Number of Columns:</p>
                <input type="number" ref={this.numColsInput } className="numCols"/>
                <p>Number of Mines:</p>
                <input type="number" ref={this.numBombsInput} className="numBombs"/>
                <br/>
                <button className="startGame" onClick={this.startGame.bind(this)}>Start!</button>
              </div>
            :
            <h1>Game has started</h1>
            //board goes here

          }
          

          { Object.keys(this.props.session.users).map( ( u ) => {
            return <span className="user-lobby" key={u}>{u}</span>;
          } )}
        </div>
      </div>
    );
  }
}

Lobby.propTypes = {
  session_id: PropTypes.number.isRequired,
  session: PropTypes.object,
  sessionType : PropTypes.string.isRequired,
};

export default withTracker( ( props ) => {
  return {
    session: Sessions.findOne( { "id": props.session_id } )
  };
} )( Lobby );

