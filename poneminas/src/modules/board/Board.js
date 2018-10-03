import React, { Component } from "react";
import Box from "../box/Box";
import "./Board.css";

export default class Board extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      dimensions: { rows: 5, cols: 5 },
      numBombs: 2
    };
  }

  // See below for more details on randint function:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  getRandomInt( min, max ) {
    min = Math.ceil( min );
    max = Math.floor( max );
    return Math.floor( Math.random() * (max - min) ) + min; //The maximum is exclusive and the minimum is inclusive
  }

  render() {
    return (
      <div id="board-container">
        <div className="grid-container" style={{ "gridTemplateColumns": `repeat(${this.state.dimensions.cols}, 1fr)` }}>
          {new Array( this.state.dimensions.rows * this.state.dimensions.cols )
            .fill( null )
            .map( ( e, i ) => <Box key={i}/> )}
        </div>
      </div>
    );
  }
}
