const MongoClient = require("mongodb").MongoClient
const mongoDB = "mongodb+srv://maximeparisi:4nloXstxn8UHz1L7@cluster0.bbwhcld.mongodb.net/?retryWrites=true&w=majority";

console.log("test")
MongoClient.connect(mongoDB, function(err, db) {
  console.log("ttit")
  var dbo = db.db("mydb");
  dbo.createCollection("users", function(err, res) {
    if (err) throw err;
    db.close();
  });
  dbo.createCollection("chats", function(err, res) {
    if (err) throw err;
    db.close();
  });
});

const express = require('express');
const http = require('http');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});
const PORT = process.env.PORT || 3001;

const { join } = require('node:path'); 


io.on('connection', (socket) => {
  socket.on('helloServeur', (arg) => {        // connection client -> serveur
    console.log(arg);
  });
});
io.on('connection', (socket) => {
  socket.emit('helloClient', 'connection serveur -> client');  // co serveur-> client
});

io.on("connection", (socket)=> {
  let room = "general"
    MongoClient.connect(mongoDB, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection(room).findOne({}, function(err, result) {
        if (err) throw err;
        socket.emit("outputmessage", result)
        console.log(result.name);
        db.close();
      });
    });

  console.log("a user connected");
  socket.on("disconnect", ()=> {
    console.log("user disconnected")
  })

  socket.on("chat", (cht) => {
    socket.join(cht)
    room = cht
  })

  socket.on("chatmessage", (msg) => {
    MongoClient.connect(mongoDB, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myobj = { message: msg};
      dbo.collection("chats").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
      socket.emit("message", msg)
    });
  })

  socket.on("user", (usr) => {
    MongoClient.connect(mongoDB, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myobj = { user: usr };
      dbo.collection("users").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    }); 
  }) 
})

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/public/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



