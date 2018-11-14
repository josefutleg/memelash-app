import React, { Component } from "react";
import "./App.css";
import { _signUp, _login } from "./services/AuthService";

class App extends Component {
  constructor() {
    super();

    this.state = {
      logged_in: false,
      username: "",
      userId: ""
    };
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
        this.setState({ logged_in: true }, function() {
          localStorage.setItem("token", res.token);
        });
      } else {
        alert("you were not logged in");
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

  render() {
    return (
      <div className="App">
        {this.state.logged_in === true && (
          <div className="header">
            <button onClick={this.logout}>log out</button>
            <button
              onClick={
                (this.test = event => {
                  console.log(this.state);
                })
              }
            >
              test
            </button>
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
        <button
          onClick={
            (this.test = event => {
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
