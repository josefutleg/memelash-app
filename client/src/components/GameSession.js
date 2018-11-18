import React, {Component} from "react";
import PlayButton from './PlayButton';

class GameSession extends Component {
    constructor(props) {
        super(props);
        this.play = this.play.bind(this);
        this.state = {
            logged_in: props.logged_in,
            username: props.username,
            userId: props.userId,
            // wasClick: props.onClick
        }
    }

    play = event => {
        console.log("Lets play")
        console.log(this.state)
    }

    render() {
        return (
            <div className="gameContainer">
                <h3>game</h3>
                <PlayButton 
                    logged_in={this.props.logged_in}
                    username={this.props.username}
                    userId={this.props.userId}
                />
                <button onClick={this.props.leaveGame}>leave game</button>
            </div>
        )
    }
}

export default GameSession;