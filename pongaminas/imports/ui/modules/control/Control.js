import React from "react";
import PropTypes from "prop-types";
import "./control.css";
import { withTracker } from "meteor/react-meteor-data";
import { Sessions } from "../../../api/sessions";
import {Meteor} from "meteor/meteor";

class Control extends React.Component {

  constructor(props){
    super(props);
    this.interval = undefined;
    this.state = {
      duration: 0
    };
  }

  componentDidMount(){
    this.interval = setInterval(() =>{
      this.setState({duration: this.state+1});
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let bombsFound = 0;

    this.props.session.users.filter((u) =>{
      return u._id === this.props.currentUser._id;
    });

    let status = (
      <div>
        <div>
          <span>{"Session: "}</span>
          <span className="dashboard-item">{this.props.session._id}</span>
        </div>
        <div>
          <span>{"Time: "}</span>
          <span className="dashboard-item">{this.state.duration}</span>
        </div>
        <div>
          <span>{"Bombs: "}</span>
          <span className="dashboard-item">{this.props.session.config.numBombs - bombsFound}</span>
        </div>
      </div>
    );

    let bar = (
      <span>...</span>
    );
    if ( this.props.onGame ) {
      bar = (
        <div id="race-status-container">
          <i className="fas fa-circle"/>
          <button className="control-btn"><i className="fas fa-comments"/></button>
        </div>
      );
    }

    return (
      <div id="control">
        <div id="control-container">
          <div id="dashboard">
            <span>Buscaminas</span>
            {this.props.onGame && status}
          </div>
        </div>
        <div id="status">
          {bar}
        </div>
      </div>
    );
  }
}

Control.propTypes = {
  onGame: PropTypes.bool.isRequired,
  session_id: PropTypes.number.isRequired,
  session: PropTypes.object,
  currentUser : PropTypes.object,
};

export default withTracker( (props) => {
  return {
    session: Sessions.findOne( { "id": props.session_id } ),
    currentUser: Meteor.user()
  };
} )( Control );
