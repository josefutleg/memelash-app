import React, {Component} from "react";
import socketIOClient from 'socket.io-client'

class PlayButton extends Component {
    constructor(props) {
        super(props);
        this.play = this.play.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            logged_in: props.logged_in,
            username: props.username,
            userId: props.userId,
            startSess: false,
            memeSrc: "",
            commentSub: false,
            value:"",
            commentNum: 0,
            endpoint: "http://localhost:3001",
            color: 'white'
        }
    }

    send = () => {
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('change color', this.state.color)
    }

    setColor = (color) => {
        this.setState({ color })
    }

    setMemeImg = event => {
        this.setState({memeSrc: "https://imageresizer.static9.net.au/qifWHWByMwnsA068tqYbnw_nFz8=/396x0/http%3A%2F%2Fprod.static9.net.au%2F_%2Fmedia%2F2017%2F05%2F24%2F13%2F27%2FChloe-meme-imgflip.jpg"})
    }

    play = event => {
        this.setMemeImg();
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('display image', this.state.memeSrc)
        this.setState({startSess: true})
        console.log("Lets play")
        console.log(this.state)
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        var comment = this.state.value;
        var commentL = comment.length + 1;
        this.setState({commentNum: commentL})
    }
    
    handleSubmit(event) {
        // alert('A name was submitted: ' + this.state.value);
        var comment = this.state.value;
        console.log(comment);
        console.log(this.state)
        console.log(this.state.commentNum)
        this.submitComment(comment);
        event.preventDefault();
    }

    submitComment = (comment) => {
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('display comment', comment)
    }

    render() {
        const socket = socketIOClient(this.state.endpoint);
        socket.on('change color', (col) => {
            document.body.style.backgroundColor = col
        })
        // socket.on('display')

        return (
            <div className="playButton">
                {this.state.startSess === false && (
                    <button
                        onClick={this.play}
                    >
                    play
                    </button>
                )}
                {this.state.startSess === true && (
                    <div className="gameSess">
                        <img alt="sample" src={this.state.memeSrc} ></img>
                        <form onSubmit={this.handleSubmit}>
                            <textarea type="text" value={this.state.value} onChange={this.handleChange} />
                            <input type="submit"  value="Submit" />
                            {this.state.commentNum > 180 && 
                                <p>Too long. Make it {this.state.commentNum - 180} characters shorter. </p>
                            }
                        </form>
                        
                    </div>
                )}
                <div style={{ textAlign: "center" }}>
                    <button onClick={() => this.send() }>Change Color</button>
                    <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
                    <button id="red" onClick={() => this.setColor('red')}>Red</button>
                </div>
            </div>  
        )
    }
}

export default PlayButton;