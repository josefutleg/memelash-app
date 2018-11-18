const express = require("express");
const mongojs = require("mongojs");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PORT = 3001;
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

// app.use(bodyParser());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const databaseUrl = "memelash_db";
const collections = ["games"];
const db = mongojs(databaseUrl, collections);

db.on("error", function(error) {
  console.log("Database Error:", error);
});

require("dotenv").config();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  next();
});

function verifyToken(req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decod) => {
      if (err) {
        res.status(403).json({
          message: "Wrong Token"
        });
      } else {
        req.decoded = decod;
        next();
      }
    });
  } else {
    res.status(403).json({
      message: "No Token"
    });
  }
}

app.get("/", function(req, res) {
  res.send(
    "routes available: login : post -> /login, signup : post -> /signup, get all the pets: get -> /pets, get one pet: get -> /pets/:id, update a pet: post -> /pets/update/:id, deleting a pet: post -> /pets/:id, creating a pet: post -> /pets"
  );
});

//curl -d "username=fred&password=unodostresgreenbaypackers" -X POST http://localhost:3001/login
/*
	this will return

	{"message":"successfuly authenticated","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmM1OTZjOGUxOTZmYmIwZTdkNWI0MGYiLCJ1c2VybmFtZSI6ImZyZWQiLCJpYXQiOjE1Mzk2NzU4OTIsImV4cCI6MTUzOTY5MDI5Mn0.xalv4I9rSmKf9LV6QaeJboV4NvY0F7wIltDMc-o_amQ"}
*/

var userId, username;
app.post("/login", function(req, res) {
  // console.log(username + " " + password)
  db.users.findOne(
    {
      username: req.body.username
    },
    function(error, result) {
      if (!result) return res.status(404).json({ error: "user not found" });

      if (!bcrypt.compareSync(req.body.password, result.password))
        return res.status(401).json({ error: "incorrect password " });

      const payload = {
        _id: result._id,
        username: result.username
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "4h"
      });
      console.log(result);
      userId = result._id;
      username = result.username;

      return res.json({
        message: "successfuly authenticated",
        token: token,
        username: result.username,
        userId: result._id,
        score: result.score,
        currentGame: result.currentGame,
        input: result.input,
        vote: result.vote
      });
    }
  );
});

//curl -d "username=fred&password=unodostresgreenbaypackers" -X POST http://localhost:3001/signup
app.post("/signup", function(req, res) {
  db.users.findOne(
    {
      username: req.body.username
    },
    function(error, result) {
      if (result) return res.status(404).json({ error: "user already exists" });

      if (!req.body.password)
        return res.status(401).json({ error: "you need a password" });

      if (req.body.password.length <= 5)
        return res
          .status(401)
          .json({ error: "password length must be greater than 5" });

      console.log("got to line 92");

      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          db.users.insert(
            {
              username: req.body.username,
              password: hash,
              score: 0,                 
              currentGame: null,    
              input: null,                
              vote: null
            },
            function(error, user) {
              console.log("got to line 101");

              // Log any errors
              if (error) {
                res.send(error);
              } else {
                res.json({
                  message: "successfully signed up"
                });
              }
            }
          );
        });
      });
    }
  );
});

app.post("/games", function(req, res){
  db.games.find(function(error,data){
    res.json(data);
  })
});

//Joining a Game
var gameId, gameRoom;
app.post("/games/:id", verifyToken, function(req, res){
  db.games.findOne({
    "_id": mongojs.ObjectID(req.params.id)
  }, function(error, result) {
    if (error) {
        res.send(error);
    } else {
        res.json(result);
        gameId = result._id;
        gameRoom = result.room;
        console.log('/games/id hits :' + JSON.stringify(result))
    }
});
});

app.post('/games/update/:id', verifyToken, function(req, res) {
  db.games.findAndModify({
      query: {
          "_id": mongojs.ObjectId(req.params.id)
      },
      update: {
          $push: {
              "players": [{
                "userId": req.body.userId,
                "userName": req.body.userName
              }]
          }
      },
      new: true
  }, function(err, updatedGame) {
      res.json(updatedGame);
  });
});

app.post('/games/leave/:id', verifyToken, function(req, res) {
  db.games.findAndModify({
      query: {
          "_id": mongojs.ObjectId(req.params.id)
      },
      update: {
          $pull: {
              "players": [{
                "userId": req.body.userId,
                "userName": req.body.userName
              }]
          }
      },
      new: true
  }, function(err, updatedGame) {
      res.json(updatedGame);
  });
});

// app.post('/games/create/:id', verifyToken, function(req, res) {
//   db.games.createIndex()
// })

server.listen(PORT, function() {
  console.log(
    "🌎 ==> Now listening on PORT %s! Visit http://localhost:%s in your browser!",
    PORT,
    PORT
  );
});

//io socket ====================================
const test = socket => {
  let message = "sent from the socket!";
  socket.emit("FromAPI", message);
};

io.on("activeGame", socket => {
  console.log("a game has just started")
})

io.on('connection', socket => {
  console.log('User connected')

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })

  socket.on('change color', (color) => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log('Color Changed to: ', color)
    io.sockets.emit('change color', color)
  })

  socket.on('display comment', comment => {
    console.log('Comment submitted: ' + comment);
    io.sockets.emit('display comment', comment);
    // db.testcomment.insert({comment});
    db.games.findAndModify({
      query: {
        "room" :gameRoom
      }, 
      update: {
        //should be a push - but is a set to keep database small
        $set: {
          players: [{
            id: userId,
            user: username
          }],
          timer: null,            //interval is created once game starts. this will change constantly and communicate with the socket to keep the timer the same on all users pages
          currentMeme: null,      //when this changes, it should be the same for all users in the room
          answers: [{
            id: userId,         //this will link to db.users' _id. when appended to page, set each radio input's #id value to each unique _id
            input: comment
          }],
          active: false 
        } 
      }
    })
  })

  socket.on('display image', image => {
    console.log("Meme image chosen: " + image)
    io.sockets.emit('display image', image)
    db.games.findAndModify({
      query: {
        "room": gameRoom
      },
      update: {
        $set: {
          currentMeme: image,
        }
      }
    })
  })
  
  
})
//===============================================================
