import React, { Component } from "react";
import PlayButton from "./PlayButton";

class GameSession extends Component {
  constructor(props) {
    super(props);
    this.play = this.play.bind(this);
    this.state = {
      logged_in: props.logged_in,
      username: props.username,
      userId: props.userId
      // wasClick: props.onClick
    };
  }

  play = event => {
    console.log("Lets play");
    console.log(this.state);
  };

  render() {
    return (
      <div className="gameContainer" id="flyIn">
        <h3>game</h3>
        <button
          className="serviceButton"
          id="logButton"
          style={{ backgroundColor: "tomato", borderColor: "tomato" }}
          onClick={this.props.leaveGame}
        >
          leave game
        </button>

        <PlayButton
          logged_in={this.props.logged_in}
          username={this.props.username}
          userId={this.props.userId}
        />
      </div>
    );
  }
}

export default GameSession;
