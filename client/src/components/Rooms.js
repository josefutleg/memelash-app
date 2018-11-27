import React, { Component } from "react";
import "../App.css";
import PlayButton from "./PlayButton";

class Rooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: props.logged_in,
      username: props.username,
      userId: props.userId,
      joinedGame: false
    };
  }

  render() {
    return (
      <div
        className="resultsContainer"
        data-id={this.props._id}
        style={{
          backgroundColor: this.props.room,
          borderColor: this.props.room
        }}
        onClick={this.props.join}
      >
        <p id="resultsP" data-id={this.props._id} key={this.props._id}>
          #{this.props.room} room
        </p>
        <p id="resultsP1" data-id={this.props._id}>
          # of players
        </p>
        <p id="resultsP2" data-id={this.props._id}>
          select to join!
        </p>

        {/* might not need this anymore. hold for now */}
        {/* <button
          className="joinButton"
          data-id={this.props._id}
          onClick={this.props.join}
          setState={this.setGameSession}
          style={{
            backgroundColor: this.props.room,
            borderColor: this.props.room
          }}
        > */}
          {/* <span style={{fontSize:"14px"}}>#{this.props.room}</span>
          <br />
          <span style={{fontSize:"12px"}}># of players</span>
          <br />           */}
          {/* <span style={{ fontSize: "12px" }}>join!</span>
        </button> */}

        {/* comment back in when ready */}
        {/* {this.props.didJoin === true && (
          <PlayButton
            onClick={this.props.join}
            data-id={this.props.id}
            logged_in={this.state.logged_in}
            username={this.state.username}
            userId={this.state.userId}
          />
        )} */}
      </div>
    );
  }
}

export default Rooms;
