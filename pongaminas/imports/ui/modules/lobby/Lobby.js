import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Sessions } from "../../../api/sessions";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import "./lobby.css";
import Board from "../board/Board";

//cuando le doy a crear puede que me haya equivocado y quisiera devolver a unirme a sala , seria bueno tener un boton que me haga un render de la pagina principal

//cuando termino el juego seria igualmente util tener un boton que me devuelva la pagina principal de nuevo , en caso de que quiera volver a jugar
class Lobby extends Component {
  constructor( props ) {
    super( props );
    this.state = { gameStart: false };

    this.numRowsInput = React.createRef();
    this.numColsInput = React.createRef();
    this.numBombsInput = React.createRef();
    this.boardRef = React.createRef();
  }

  startGame() {
    const cols = parseInt(this.numColsInput.current.value);
    const rows = parseInt(this.numRowsInput.current.value);
    const bombs = parseInt(this.numBombsInput.current.value);
    if ( cols <= 0 || rows <= 0 ) {
      alert( "Rows and columns must be positive integers >0" );
    }
    else {
      if ( bombs > 0.5 * cols * rows ) {
        alert( "The number of bombs must me less than half of the board" );
      }
      else {
        let session = parseInt( this.props.session_id );
        if ( session ) {
          let s = Sessions.findOne( { "id": session } );

          Sessions.update(
            { _id: s._id },
            {
              $set: {
                gameStart: new Date(),
                config:
                  {
                    numCols: cols,
                    numRows: rows,
                    numBombs: bombs
                  }
              }
            }
          );

          this.setState( { gameStart: true } );
        }
      }
    }
  }

  render() {
    let game;
    if(this.props.session.gameStart !== undefined){
      let winnerName;
      if(this.props.winner){
        winnerName = Object.keys(this.props.session.users).map(k=>[k,this.props.session.users[k].status==="Won"]).find(e=>{
          return e[1];
        })[0];
        this.boardRef.current.blockBoard();
      }
     
      game = <div>
        {this.props.winner ?  <h1>The winner is {winnerName}</h1> : "" }
        <div>
          <Board
            session_id={this.props.session._id}
            rows={this.props.session.config.numRows}
            cols={this.props.session.config.numCols}
            bombs={this.props.session.config.numBombs}
            currentUser={this.props.user}
            ref={this.boardRef}/>
        </div>
      </div>;
    }

    return (
      <div id="lobby-container">
        <h1 id="lobby-session">Session {this.props.session.id}</h1>
        <div id="lobby-users">

          {this.props.session.gameStart === undefined ?
            this.props.sessionType === "join" ?
              <h1 className="Please wait">Please wait while party leader starts the game</h1>
              :
              <div className="setupGame">
                <p>Number of Rows:</p>
                <input type="number" ref={this.numRowsInput} className="numRows"/>
                <p>Number of Columns:</p>
                <input type="number" ref={this.numColsInput} className="numCols"/>
                <p>Number of Mines:</p>
                <input type="number" ref={this.numBombsInput} className="numBombs"/>
                <br/>
                <button className="startGame" onClick={this.startGame.bind( this )}><i className="fas fa-play"/></button>
              </div>
            :
            game
            
          }
          
          <h1>Leaderboard</h1>
          {
            Object.keys(this.props.session.users).map(k=>[k,this.props.session.users[k].score,this.props.session.users[k].status=="Lost"]).sort((a,b)=>{
              if(b[2]!==a[2]){
                return b[2] ? -1 : 1;
              }
              return b[1]-a[1];
            }).map(e=>{
              let styleClass = "user-lobby ";
              styleClass += e[2]?"lost":"";
              return <span className={styleClass} key={e[0]}>{e[0]}: {e[1]}</span>;
            })
          }
        </div>
      </div>
    );
  }
}

Lobby.propTypes = {
  session_id: PropTypes.number.isRequired,
  session: PropTypes.object,
  sessionType: PropTypes.string.isRequired,
  user: PropTypes.object,
  winner: PropTypes.bool.isRequired,
};

export default withTracker( ( props ) => {
  return {
    session: Sessions.findOne( { "id": props.session_id } ),
    user: Meteor.user(),
    winner : Object.keys(Sessions.findOne( { "id": props.session_id } ).users).map(k=>Sessions.findOne( { "id": props.session_id } ).users[k].status=="Won").some((element) =>{
      return element;
    })
  };
} )( Lobby );

