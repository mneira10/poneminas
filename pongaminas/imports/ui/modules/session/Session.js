import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Sessions } from "../../../api/sessions";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import Lobby from "../lobby/Lobby";
import "./session.css";


class Session extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      session: {
        active: false,
        number: null
      }
    };
    this.join_session_input = React.createRef();
  }

  joinSession( e ) {
    if(e) {
      e.preventDefault();
    }
    let session = parseInt( this.join_session_input.current.value );
    if(session){
      let s = Sessions.findOne( { "id": session } );
      if ( s.users.some( ( u ) => u._id === this.props.user._id ) ) {
        this.setState( { session: { active: true, number: session, users: s.users } } );
      }
      else {
        Sessions.update(
          { _id: s._id },
          { "$push": { users: this.props.user } }
        );
        this.setState( { session: { active: true, number: session, users: [ ...s.users, {...this.props.user, bombs: 0} ] } } );
      }
    }
  }

  createSession() {
    const newSession = this.props.countSessions + 1;
    this.setState( { session: { active: true, number: newSession, users: [ this.props.user ] } } );
    Sessions.insert( {
      id: newSession, // session id
      createdAt: new Date(), // current time,
      users: [ {...this.props.user, bombs:0} ]
    } );
  }

  inputHandle(e) {
    if (e.key === "Enter") {
      this.joinSession();
    }
  }

  componentDidMount(){
    this.join_session_input.current.focus();
  }

  render() {
    return (
      <div id="session-container">
        {!this.state.session.active
          ?
          // if user is not in a session 
          <div id="session-choose-container">
            <div id="session-choose-title">
              <h2>Create or join a session</h2>
            </div>
            <div id="session-choose" >
              <div id="session-create" className="session-opt" onClick={this.createSession.bind(this)}>
                <div>
                  <h1>Create</h1>
                </div>
              </div>
              <div id="session-join" className="session-opt">
                <div>
                  <h1>Join</h1>
                  <input type="number" ref={this.join_session_input} onKeyPress={this.inputHandle.bind(this)}/>
                  <button onClick={this.joinSession.bind( this )}><i className="fas fa-play"/></button>
                </div>
              </div>
            </div>
          </div>
          :
          // if user is in a session
          <Lobby session_id={this.state.session.number}/>
        }
      </div>
    );
  }
}


export default withTracker( () => {
  return {
    sessions: Sessions.find( {} ).fetch(),
    countSessions: Sessions.find( {} ).count(),
    user: Meteor.user()
  };
} )( Session );

Session.propTypes = {
  sessions: PropTypes.array,
  countSessions: PropTypes.number,
  user: PropTypes.object
};
