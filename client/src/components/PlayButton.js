import React, {Component} from "react";
import socketIOClient from 'socket.io-client';

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

    // componentDidMount() {
    //     _joinGame(currentGame, this.state.userId, this.state.username, )
    // }

    play = event => {
        // this.setMemeImg();
        // const socket = socketIOClient(this.state.endpoint);
        // socket.emit('display image', this.state.memeSrc)
        // this.sendImage();
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
        this.setState({commentSub: true});
        console.log(comment);
        console.log(this.state)
        console.log(this.state.commentNum)

        this.sendComment(comment);

        event.preventDefault();
    }
    //Chaning Background with Socket
    sendColor = () => {
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('change color', this.state.color)
    }
    setColor = (color) => {
        this.setState({ color })
    }
    //Changing Image with Socket
    displayImage = () => {

    }
    sendImage = () => {
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('display image', this.state.memeSrc);
    }
    setMemeImg = (src) => {
        this.setState({memeSrc: src})
    }
    //Sending comment with Socket
    sendComment = () => {
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('display comment', this.state.value)
    }

    render() {
        const socket = socketIOClient(this.state.endpoint);
        socket.on('change color', (col) => {
            document.body.style.backgroundColor = col
        })

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

                            <textarea name="comment" id="text-area" type="text" value={this.state.value} onChange={this.handleChange} />
                            <input type="submit"  value="Submit" />

                            {this.state.commentNum > 180 && 
                                <p>Too long. Make it {this.state.commentNum - 180} characters shorter. </p>
                            }
                        </form>
                    </div>
                )}
                <div style={{ textAlign: "center" }}>
                    <button onClick={() => this.sendImage() }>Send Meme Image</button>
                    <button id="success" onClick={() => this.setMemeImg('https://upload.wikimedia.org/wikipedia/en/thumb/f/ff/SuccessKid.jpg/256px-SuccessKid.jpg')}>Success kid</button>
                    <button id="confused" onClick={() => this.setMemeImg("https://imageresizer.static9.net.au/qifWHWByMwnsA068tqYbnw_nFz8=/396x0/http%3A%2F%2Fprod.static9.net.au%2F_%2Fmedia%2F2017%2F05%2F24%2F13%2F27%2FChloe-meme-imgflip.jpg")}>Confused Girl</button>
                </div>
                <div>
                    <button onClick={() => this.sendColor() }>Change Color</button>
                    <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
                    <button id="red" onClick={() => this.setColor('red')}>Red</button>
                </div>
            </div>  
        )
    }
}

export default PlayButton;

        // socket.on('display comment', (com) => {
        //     var x = document.createElement("P");                        
        //     var t = document.createTextNode("This is a paragraph.");    
        //     x.appendChild(t);                                          
        //     document.body.appendChild(x); 
        // })
        // socket.on("display comment", (string) => {
        //     return fetch(`http://localhost:3001/games/update/${currentGame}`, {
        //         method: 'POST',
        //         headers: {
        //           'Accept': 'application/json',
        //           'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({string})
        //       }).then(res => res.json())
        // })

        {/* <div style={{ textAlign: "center" }}>
                    <button onClick={() => this.send() }>Change Color</button>
                    <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
                    <button id="red" onClick={() => this.setColor('red')}>Red</button>
                </div> */}