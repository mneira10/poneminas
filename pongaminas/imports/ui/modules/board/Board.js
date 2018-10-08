import React, { Component } from "react";
import "./Board.css";
import Box, { constants } from "../box/Box";
import PropTypes from "prop-types";
import { Sessions } from "../../../api/sessions";

export default class Board extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      dimensions: { rows: props.rows, cols: props.cols },
      numBombs: props.bombs
    };
    this.cells = [];
    this.logicCells = [];
    this.firstClick = false;
    this.lost = false;
    this.bombs = [];

    this.boxClickHandle = this.boxClickHandle.bind( this );
    this.showBoard = this.showBoard.bind( this );
    this.bombDiscovered = this.bombDiscovered.bind( this );

    this.initGame();
  }

  static getRandomInt( min, max ) {
    min = Math.ceil( min );
    max = Math.floor( max );
    return Math.floor( Math.random() * (max - min) ) + min; // [min, max)
  }

  get_initial_state() {
    let c = [];
    for ( let i = 0; i < this.state.dimensions.rows; i++ ) {
      c.push( [] );
      for ( let j = 0; j < this.state.dimensions.cols; j++ ) {
        c[ i ][ j ] = { state: 0, row: i, col: j };
      }
    }
    return c;
  }

  placeBombs( c1, numBombs ) {
    let freeCells = c1.flat();

    freeCells = freeCells.filter((c) => c.state !== constants.BOMB);

    let updateNeighbors = ( r, c ) => {
      for ( let i = Math.max( 0, r - 1 ); i <= Math.min( r + 1, this.state.dimensions.rows - 1 ); i++ ) {
        for ( let j = Math.max( 0, c - 1 ); j <= Math.min( c + 1, this.state.dimensions.cols - 1 ); j++ ) {
          if ( !(i === r && j === c) && !isNaN( c1[ i ][ j ].state ) ) {
            c1[ i ][ j ].state++;
          }
        }
      }
    };

    for ( let i = 0; i < numBombs; i++ ) {
      let index = Board.getRandomInt( 0, freeCells.length );
      let cellBomb = freeCells[ index ];
      cellBomb.state = constants.BOMB;
      this.bombs.push( [ cellBomb.row, cellBomb.col ] );
      updateNeighbors( cellBomb.row, cellBomb.col );
      freeCells.splice( index, 1 );
    }
  }

  get_neighbours( r, c ) {
    let neighbours = [];
    for ( let i = Math.max( 0, r - 1 ); i <= Math.min( r + 1, this.state.dimensions.rows - 1 ); i++ ) {
      for ( let j = Math.max( 0, c - 1 ); j <= Math.min( c + 1, this.state.dimensions.cols - 1 ); j++ ) {
        neighbours.push( this.cells[ i ][ j ] );
      }
    }
    return neighbours;
  }

  floodFill( r, c, max ) {
    if ( max !== 0 && !this.cells[ r ][ c ].current.show() && !isNaN( this.cells[ r ][ c ].current.props.state ) ) {
      this.cells[ r ][ c ].current.state.show = true;
      let neighs = this.get_neighbours( r, c );
      neighs.forEach( ( n ) => {
        n = n.current;
        if ( this.cells[ n.props.row ][ n.props.col ].current.props.state === 0 ) {
          this.floodFillZero( n.props.row, n.props.col );
        }
        else {
          this.floodFill( n.props.row, n.props.col, max - 1 );
        }
      } );
    }
  }

  floodFillZero( r, c ) {
    if ( !this.cells[ r ][ c ].current.show() && !isNaN( this.cells[ r ][ c ].current.props.state ) ) {
      this.cells[ r ][ c ].current.state.show = true;
      if ( this.cells[ r ][ c ].current.props.state === 0 ) {
        let neighs = this.get_neighbours( r, c );
        neighs.forEach( ( n ) => {
          n = n.current;
          this.floodFillZero( n.props.row, n.props.col );
        } );
      }
    }
  }

  getBombsArround(r,c){
    let count  = 0;
    for ( let i = Math.max( 0, r - 1 ); i <= Math.min( r + 1, this.state.dimensions.rows - 1 ); i++ ) {
      for ( let j = Math.max( 0, c - 1 ); j <= Math.min( c + 1, this.state.dimensions.cols - 1 ); j++ ) {
        if ( !(i === r && j === c) && isNaN( this.logicCells[ i ][ j ].state ) ) {
          count++;
        }
      }
    }
    return count;
  }

  boxClickHandle( r, c, state ) {
    if ( !this.lost ) {
      if ( !this.cells[ r ][ c ].current.show() ) {
        this.cells[ r ][ c ].current.show( true );
        if ( !this.firstClick ) {

          if(state === constants.BOMB){
            this.logicCells[r][c].state = this.getBombsArround(r,c);

            this.placeBombs(this.logicCells, 1);
            let ind = this.bombs.indexOf([r,c]);
            this.bombs.splice(ind, 1);

            for ( let i = Math.max( 0, r - 1 ); i <= Math.min( r + 1, this.state.dimensions.rows - 1 ); i++ ) {
              for ( let j = Math.max( 0, c - 1 ); j <= Math.min( c + 1, this.state.dimensions.cols - 1 ); j++ ) {
                if ( !(i === r && j === c) && !isNaN( this.logicCells[ i ][ j ].state ) ) {
                  this.logicCells[ i ][ j ].state--;
                }
              }
            }
          }

          // TODO: remove bomb
          // TODO: 3 as depth
          this.floodFill( r, c, 3 );
          this.firstClick = true;
          this.forceUpdate();
        }
        else if ( state === constants.BOMB ) {
          this.lost = true;
          this.showBoard();

          let up = {};
          up[`users.${this.props.currentUser.username}.status`] = "Lost";
          Sessions.update(
            {_id: this.props.session_id},
            { "$set": up }
          );
        }
        else if ( state === 0 ) {
          this.floodFillZero( r, c );
          this.forceUpdate();
        }
      }
      else {
        this.showElse( r, c );
      }
    }
  }

  bombDiscovered(isAdding){
    let up = {};
    up[`users.${this.props.currentUser.username}.score`] = (isAdding ? 1 : -1);
    Sessions.update(
      {_id: this.props.session_id},
      { "$inc":  up}
    );
    let s = Sessions.findOne({"_id": this.props.session_id});
    if(this.props.bombs === s.users[this.props.currentUser.username].score ){
      let won = true;
      for (let i = 0; i < this.props.rows && won; i++) {
        for (let j = 0; j < this.props.cols && won; j++) {
          if(this.cells[i][j].current.props.state === constants.BOMB && this.cells[i][j].current.state.flag !== 1) {
            won = false;
          }
        }
      }
      if(won){
        let u = {};
        u[`users.${this.props.currentUser.username}.status`] = "Won";
        Sessions.update(
          {_id: this.props.session_id},
          {"$set": u}
        );
      }
    }
  }

  initGame() {
    this.logicCells = this.get_initial_state();
    this.placeBombs( this.logicCells, this.state.numBombs );
  }

  showBoard() {
    for ( let i = 0; i < this.cells.length; i++ ) {
      for ( let j = 0; j < this.cells[ i ].length; j++ ) {
        this.cells[ i ][ j ].current.state.show = true;
      }
    }
    this.forceUpdate();
  }

  blockBoard(){
    this.lost = true;
  }

  showElse( r, c ) {
    let ne = this.get_neighbours( r, c );
    if ( ne.filter( i => i.current.state.flag !== 0 ).length >= this.cells[ r ][ c ].current.props.state ) {
      ne.forEach( i => {
        if ( i.current.state.flag === 0 ) {
          i.current.state.show = true;
          if ( i.current.props.state === constants.BOMB ) {
            this.lost = true;
          }
        }
      } );
      this.forceUpdate();
    }
  }

  render() {
    this.cells = [];
    return (
      <div id="board-container">
        <div className="grid-container" style={{ "gridTemplateColumns": `repeat(${this.state.dimensions.cols}, 1fr)` }}>
          {this.logicCells.flat().map( ( c, i ) => {
            if ( !this.cells[ c.row ] ) {
              this.cells.push( [] );
            }
            this.cells[ c.row ].push( React.createRef() );
            return (
              <Box key={i}
                state={c.state}
                row={c.row}
                col={c.col}
                ref={this.cells[ c.row ][ c.col ]}
                boxClickHandle={this.boxClickHandle}
                bombDiscovered={this.bombDiscovered}/>
            );
          } )}
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  bombs: PropTypes.number.isRequired,
  session_id: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired
};
