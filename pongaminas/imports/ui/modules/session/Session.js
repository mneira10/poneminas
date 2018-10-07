import React, { Component } from "react";

import { withTracker } from "meteor/react-meteor-data";
import { Sessions } from "../../../api/sessions";
import PropTypes from "prop-types";



class Session extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sessionNumber : null
    };
  }
    

  joinSession() {
    // TODO
    // falta hacer esto!!
    // mire en https://www.meteor.com/tutorials/react/forms-and-events para hacer esta vuelta
    // queda seguro y ofrece mucha flexibilidad

    

  }

  createSession(){
    
    const newSession = this.props.countSessions + 1;
    this.setState({sessionNumber : newSession});

    Sessions.insert({
      id : newSession, // session id
      createdAt: new Date(), // current time
    });

  }


  render() {
    return (
      <div>

        { this.state.sessionNumber ===null ? 
          // if user is not in a session 
          <div>
            <h2>Create or join a session</h2>
            <button onClick={this.createSession.bind(this)}>
                Create
            </button>
            <br/>
            <input type="number"/>
            <button onClick={this.joinSession.bind(this)}>
                Join
            </button> 
          </div>
          :
          // if user is in a session 
          <h1>In session: {this.state.sessionNumber}</h1>
        }
      </div>
    );
  }
}


export default withTracker(() => {
  return {
    sessions: Sessions.find({}).fetch(),
    countSessions : Sessions.find({}).count(),
  };
})(Session);

Session.propTypes = {
  sessions : PropTypes.array,
  countSessions : PropTypes.number,
};