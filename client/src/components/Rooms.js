import React, { Component } from 'react';
import '../App.css';
import PlayButton from './PlayButton'

class Rooms extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logged_in: props.logged_in,
      username: props.username,
      userId: props.userId,
      joinedGame: false
    }
  }

  render() {
    return (
      <div className="resultsContainer">
      <p id="resultsP" key={this.props._id}>  
        room name: {this.props.room}
      </p>
      <button className="join" 
        data-id={this.props._id} 
        onClick={this.props.join} 
        setState={this.setGameSession}
        >join
      </button>
      {this.props.didJoin === true && (
        <PlayButton 
        onClick={this.props.join}
        data-id={this.props.id}
        logged_in={this.state.logged_in}
        username={this.state.username}
        userId={this.state.userId}
      />
      )}
      </div>
    );
  }
}

export default Rooms;