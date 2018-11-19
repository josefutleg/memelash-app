import React, { Component } from "react";
import "./App.css";
import { _signUp, _login } from "./services/AuthService";
import GameSession from "./components/GameSession";

import {
  _getAvailableRooms,
  _joinGame,
  _findGame,
  _leaveGame
} from "./services/GameService";
import socketIOClient from "socket.io-client";
import Rooms from "./components/Rooms";
import logo from "./images/logoMeme.png";

class App extends Component {
  constructor() {
    super();
    this.state = {
      logged_in: false,
      pageLoaded: false,
      newUser: false,
      username: "",
      userId: "",
      response: false,
      endpoint: "http://localhost:3001",
      score: "",
      currentGame: null,
      input: "",
      vote: "",
      gamesAvailable: [],
      joinedGame: false
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    console.log(this.state);
    const socket = socketIOClient(endpoint);
    console.log(this.state.response);
    socket.on("FromAPI", data => this.setState({ response: `${data}` }));
    socket.emit("user connected", data => {});
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
          // alert(this.state.response);
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
    if (this.state.currentGame !== null) {
      _leaveGame(
        this.state.currentGame,
        this.state.userId,
        this.state.username,
        this.getToken()
      ).then(rj => {
        console.log(rj);
      });
      this.setState({ userId: "" });
      this.setState({ username: "" });
      this.setState({ currentGame: null });
      this.setState({ logged_in: false }, function() {
        localStorage.removeItem("token");
      });
    } else {
      this.setState({ userId: "" });
      this.setState({ username: "" });
      this.setState({ currentGame: null });
      this.setState({ logged_in: false }, function() {
        localStorage.removeItem("token");
      });
    }
  };

  changeForm = event => {
    event.preventDefault();
    // let a = document.querySelector(".logInForm");
    // a.setAttribute("id", "flyIn");
    if (this.state.newUser === false) {
      this.setState({ newUser: true });
    } else this.setState({ newUser: false });
  };

  signUp = event => {
    event.preventDefault();

    let inputs = event.target.children;
    let username = inputs[0].value;
    let password = inputs[2].value;
    let passwordConf = inputs[4].value;

    if (password === passwordConf) {
      return _signUp(username, password).then(res => {
        console.log(res);
        alert(res.message);
        this.setState({ newUser: false });
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
    this.setState({ joinedGame: true });

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

  pageLoad = () => {
    setTimeout(function(){
      this.setState({pageLoaded : true});
    }.bind(this), 2000)
  }

  render() {
    return (
      <div className="App" onLoad={this.pageLoad}>
        {this.state.logged_in === true && (
          <div className="loggedIn">
            <div className="header">
              <img
                src={logo}
                alt="memelash logo"
                id="logo2"
              />
              <button
                className="serviceButton"
                id="logButton"
                onClick={this.logout}
              >
                <span>log out</span>
              </button>
              <h4 id="logInName">hello, {this.state.username}!</h4>
              <div className="headerLine" />
            </div>
          </div>
        )}
        {this.state.logged_in === false && (
          <div className="form">
            <img src={logo} alt="memelash logo" id="logo" />
            {this.state.newUser === false && this.state.pageLoaded === true && (
              <div className="logInForm" id="flyIn">
                <form id="login" onSubmit={this.login}>
                  <input type="text" name="name" placeholder="username" />
                  <br />
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                  />
                  <br />
                  <button className="serviceButton" id="logButton">
                    <span>log in</span>
                  </button>
                  <button
                    onClick={this.changeForm}
                    className="serviceButton"
                    id="newUser"
                  >
                    <span>new user?</span>
                  </button>
                </form>
              </div>
            )}
            {this.state.newUser === true && (
              <div className="signUpForm" id="flyIn">
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
                  <button className="serviceButton" id="newUser">
                    <span>sign up</span>
                  </button>
                  <button
                    className="serviceButton"
                    id="logButton"
                    onClick={this.changeForm}
                  >
                    <span>back</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
        {this.state.logged_in === true && (
          <div className="roomContainer" id="flyIn">
            <h4>available games</h4>
            {this.state.gamesAvailable.map(x => (
              <Rooms
                _id={x._id}
                room={x.room}
                players={x.players}
                join={this.joinGame}
                didJoin={this.state.joinedGame}
              />
            ))}
          </div>
        )}

        {this.state.currentGame !== null && (
          <div>
            {/* <PlayButton 
              logged_in={this.state.logged_in}
              username={this.state.username}
              userId={this.state.userId}
            /> */}
            <GameSession
              logged_in={this.state.logged_in}
              username={this.state.username}
              userId={this.state.userId}
              leaveGame={this.leaveGame}
            />
          </div>
        )}
        {/* <button
          onClick={
            (this.check = event => {
              console.log(this.state);
            })
          }
        >
          test
        </button> */}
      </div>
    );
  }
}

export default App;

// http://version1.api.memegenerator.net//Generators_Search?q=funny&pageSize=25&apiKey=ed0e5625-ed2d-4049-a830-bafce8b69716
