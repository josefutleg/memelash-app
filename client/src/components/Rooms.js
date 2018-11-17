import React, { Component } from 'react';
import '../App.css';

class Rooms extends Component {
  render() {
    return (
      <div className="resultsContainer">
      <p id="resultsP" key={this.props._id}>  
        room name: {this.props.room}
      </p>
      <button className="join" data-id={this.props._id} onClick={this.props.join}>join</button>
      </div>
    );
  }
}

export default Rooms;