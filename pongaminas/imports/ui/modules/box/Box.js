import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Box.css";

export const constants = {
  "BOMB": "-"
};

const colors = {
  1: "#014f87",
  2: "#6c8701",
  3: "#873d01",
  4: "#012953",
  5: "#ffc201",
  6: "#8e0199",
  7: "#888888",
  8: "#212121",
};

export default class Box extends Component {

  constructor( props ) {
    super( props );
    this.handleClick = this.handleClick.bind( this );
    this.contextHandleClick = this.contextHandleClick.bind( this );
    this.state = { show: false, flag: 0 };
  }

  show( s, c ) {
    if ( s ) {
      this.setState( { show: s }, c );
    }
    else {
      return this.state.show;
    }
  }

  handleClick() {
    if ( this.state.flag === 0 ) {
      this.props.boxClickHandle( this.props.row, this.props.col, this.props.state );
    }
  }

  contextHandleClick( e ) {
    let lastFlag = this.state.flag;
    if ( !this.state.show ) {
      this.setState( { flag: (this.state.flag + 1) % 3 }, () =>{
        if( lastFlag === 1 && this.state.flag !== 1){
          this.props.bombDiscovered(false);
        }
        else if(lastFlag !== 1 && this.state.flag == 1){
          this.props.bombDiscovered(true);
        }
      } );
    }
    e.preventDefault();
  }

  render() {
    let box_state = this.props.state;
    if ( this.props.state === constants.BOMB ) {
      box_state = <i className="fas fa-bomb"/>;
    }
    if ( this.state.flag === 1 ) {
      box_state = <i className="fas fa-flag"/>;
    }
    else if ( this.state.flag === 2 ) {
      box_state = <i className="fas fa-question"/>;
    }

    return (
      <button className={"grid-item " + (this.state.show ? "active" : "")} 
        style={{ color: (this.state.show && colors[ this.props.state ]), fontSize: ((this.state.flag !== 0 )|| !(this.state.flag === 0 && this.state.show && (this.props.state === 0))? "1em" : "") }}
        onClick={this.handleClick}
        onContextMenu={this.contextHandleClick}>
        {this.state.flag !== 0 && box_state}
        {this.state.flag === 0 && this.state.show && (this.props.state === 0 ? "" : box_state)}
      </button>
    );
  }
}

Box.propTypes = {
  state: PropTypes.any.isRequired,
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  boxClickHandle: PropTypes.func.isRequired,
  bombDiscovered: PropTypes.func.isRequired
};
