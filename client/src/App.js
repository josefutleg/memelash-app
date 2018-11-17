import React, { Component } from "react";
import "./App.css";
import { _signUp, _login } from "./services/AuthService";
import {
  _getAvailableRooms,
  _joinGame,
  _findGame,
  _leaveGame
} from "./services/GameService";
import socketIOClient from "socket.io-client";
import Rooms from "./components/Rooms";

class App extends Component {
  constructor() {
    super();
    this.state = {
      logged_in: false,
      username: "",
      userId: "",
      response: false,
      endpoint: "http://localhost:3001",
      score: "",
      currentGame: null,
      input: "",
      vote: "",
      gamesAvailable: []
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    console.log(this.state);
    const socket = socketIOClient(endpoint);
    console.log(this.state.response);
    socket.on("FromAPI", data => this.setState({ response: `${data}` }));
    // socket.on(console.log("socket connected"));
  }

  login = event => {
    event.preventDefault();

    let inputs = event.target.children;
    let username = inputs[0].value;
    let password = inputs[2].value;
    return _login(username, password).then(res => {
      if (res.token) {
        this.setState({ userId: res.userId });
        this.setState({ username: res.username });
        this.setState({ score: res.score });
        this.setState({ currentGame: res.currentGame });
        this.setState({ input: res.input });
        this.setState({ vote: res.vote });
        this.setState({ logged_in: true }, function() {
          localStorage.setItem("token", res.token);
          alert(this.state.response);
          _getAvailableRooms().then(resultingJSON => {
            let arr = [];
            for (let i = 0; i < resultingJSON.length; i++) {
              if (resultingJSON[i].active === false) {
                arr.push(resultingJSON[i]);
              }
            }
            this.setState({ gamesAvailable: arr });
            console.log(this.state);
          });
        });
      } else {
        alert("invalid username/password");
      }
    });
  };

  logout = event => {
    event.preventDefault();
    this.setState({ userId: "" });
    this.setState({ username: "" });
    this.setState({ logged_in: false }, function() {
      localStorage.removeItem("token");
    });
  };

  signUp = event => {
    event.preventDefault();

    let inputs = event.target.children;
    let username = inputs[0].value;
    let password = inputs[2].value;
    let passwordConf = inputs[4].value;

    if (password == passwordConf) {
      return _signUp(username, password).then(res => {
        console.log(res);
        alert(res.message);
      });
    } else {
      alert("your password and password confirmation have to match!");
    }
  };
  getToken = () => {
    return localStorage.getItem("token");
  };

  joinGame = event => {
    event.preventDefault();

    let selectedGame = event.target.getAttribute("data-id");
    console.log(selectedGame);

    return _findGame(selectedGame, this.getToken()).then(resultingJSON => {
      console.log(resultingJSON);
      this.setState({ currentGame: resultingJSON._id });
      let d = document.querySelector(".roomContainer");
      d.classList.add("hidden");
      // console.log(this.state.username);
      // console.log(this.state.userId);
      _joinGame(
        resultingJSON._id,
        this.state.userId,
        this.state.username,
        this.getToken()
      ).then(rj => {
        console.log(rj);
      });
    });
  };

  leaveGame = event => {
    this.setState({ currentGame: null });
    let d = document.querySelector(".roomContainer");
    d.classList.remove("hidden");
    return _leaveGame(
      this.state.currentGame,
      this.state.userId,
      this.state.username,
      this.getToken()
    ).then(rj => {
      console.log(rj);
    });
  };

  render() {
    return (
      <div className="App">
        {this.state.logged_in === true && (
          <div className="header">
            <button onClick={this.logout}>log out</button>
            <h4>hello, {this.state.username}!</h4>
          </div>
        )}
        {this.state.logged_in === false && (
          <div className="form">
            <div className="logInForm">
              <form id="login" onSubmit={this.login}>
                <input type="text" name="name" placeholder="username" />
                <br />
                <input type="password" name="password" placeholder="password" />
                <br />
                <button>log in</button>
              </form>
            </div>
            <br />
            <div className="signUpForm">
              <form id="signUp" onSubmit={this.signUp}>
                <input type="text" name="name" placeholder="new username" />
                <br />
                <input
                  type="password"
                  name="password"
                  placeholder="new password"
                />
                <br />
                <input
                  type="password"
                  name="password"
                  placeholder="confirm password"
                />
                <br />
                <button>sign up</button>
              </form>
            </div>
          </div>
        )}
        {this.state.logged_in === true && (
          <div className="roomContainer">
            <h3>available games</h3>
            {this.state.gamesAvailable.map(x => (
              <Rooms
                _id={x._id}
                room={x.room}
                players={x.players}
                join={this.joinGame}
              />
            ))}
          </div>
        )}

        {this.state.currentGame !== null && (
          <div className="gameContainer">
            <h3>game</h3>
            <button onClick={this.leaveGame}>leave game</button>
          </div>
        )}
        <button
          onClick={
            (this.check = event => {
              console.log(this.state);
            })
          }
        >
          test
        </button>
      </div>
    );
  }
}

export default App;
