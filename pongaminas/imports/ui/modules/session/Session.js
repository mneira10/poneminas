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
        number: null,        
      },
      type : null,
    };
    this.join_session_input = React.createRef();
  }

  joinSession( e ) {
    if(e) {
      e.preventDefault();
    }
    let session = parseInt( this.join_session_input.current.value );
    console.log(session);
    if(session){
      let s = Sessions.findOne( { "id": session } );
      if ( !(this.props.user.username in s.users)) {

        // this solution makes no sense, we know. But js is the devils 3rd testicle. 
        // It did not let us do the query in any other way :(
        
        const temp = {};
        temp["users."+this.props.user.username] = {score:0};
        // temp  = {users.username : {score:0}}
        const secondObj = { "$set": temp};

        Sessions.update(
          { _id: s._id },
          secondObj
        );

     
      }
      this.setState( { session: { active: true, number: session } , type : "join"} );
    }
  }

  createSession() {
    const newSession = this.props.countSessions + 1;
    this.setState( { session: { active: true, number: newSession } , type : "create"} );
    
    const user = {};
    user[this.props.user.username] = {score:0};
    
    Sessions.insert( {
      id: newSession, // session id
      createdAt: new Date(), // current time,
      users: user,
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
          <Lobby session_id={this.state.session.number} sessionType={this.state.type}/>
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
