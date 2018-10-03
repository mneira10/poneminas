import React, { Component } from 'react'
import Box from './Box';
import './Board.css';

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {  dimensions:{rows:3,cols:3},
                        numBombs : 2};
    }

    // See below for more details on randint function:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    listButtons = []

    
    componentWillMount() {
        for (let i = 0; i < this.state.dimensions.rows*this.state.dimensions.cols; i++) {
            this.listButtons.push(<Box key={i} className="grid-item"/>);
            
        }
    }
    

    render() {
    return (
        <div className="grid-container" >
                {this.listButtons}
                {/* <button></button>        */}
            
        </div>
        
    )
    }
}
