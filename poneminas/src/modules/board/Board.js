import React, { Component } from "react";
import "./Board.css";
import Box, { constants } from "../box/Box";

export default class Board extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      dimensions: { rows: 5, cols: 5 },
      numBombs: 3
    };
    this.cells = [];
  }

  static getRandomInt( min, max ) {
    min = Math.ceil( min );
    max = Math.floor( max );
    return Math.floor( Math.random() * (max - min) ) + min; // [min, max)
  }

  initCells() {
    for ( let i = 0; i < this.state.dimensions.rows; i++ ) {
      this.cells.push( [] );
      for ( let j = 0; j < this.state.dimensions.cols; j++ ) {
        this.cells[ i ][ j ] = { state: 0, row: i, col: j };
      }
    }
  }

  placeBombs() {
    let freeCells = this.cells.flat();

    let updateNeighbors = ( r, c ) => {
      for ( let i = Math.max( 0, r - 1 ); i <= Math.min( r + 1, this.state.dimensions.rows - 1 ); i++ ) {
        for ( let j = Math.max( 0, c - 1 ); j <= Math.min( c + 1, this.state.dimensions.cols -1 ); j++ ) {
          if ( !(i === r && j === c) && !isNaN( this.cells[ i ][ j ].state ) ) {
            this.cells[ i ][ j ].state++;
          }
        }
      }
    };

    for ( let i = 0; i < this.state.numBombs; i++ ) {
      let index = Board.getRandomInt( 0, freeCells.length );
      let cellBomb = freeCells[ index ];
      cellBomb.state = constants.BOMB;
      updateNeighbors( cellBomb.row, cellBomb.col );
      freeCells.splice( index, 1 );
    }
  }

  render() {
    this.initCells();
    this.placeBombs();

    return (
      <div id="board-container">
        <div className="grid-container" style={{ "gridTemplateColumns": `repeat(${this.state.dimensions.cols}, 1fr)` }}>
          {this.cells.flat().map( ( c, i ) => <Box key={i} state={c.state} row={c.row} col={c.col}/> )}
        </div>
      </div>
    );
  }
}
