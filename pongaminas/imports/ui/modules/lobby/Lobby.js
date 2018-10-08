import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Sessions } from "../../../api/sessions";
import PropTypes from "prop-types";
import "./lobby.css";

class Lobby extends Component {
  render() {
    return (
      <div id="lobby-container">
        <h1 id="lobby-session">Session {this.props.session.id} <button><i className="fas fa-play"/></button></h1>
        <div id="lobby-users">
          {this.props.session.users.map( ( u, i ) => {
            return <span className="user-lobby" key={i}>{u.username}</span>;
          } )}
        </div>
      </div>
    );
  }
}

Lobby.propTypes = {
  session_id: PropTypes.number.isRequired,
  session: PropTypes.object
};

export default withTracker( ( props ) => {
  return {
    session: Sessions.findOne( { "id": props.session_id } )
  };
} )( Lobby );

