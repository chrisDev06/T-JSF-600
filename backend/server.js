const mongoose = require("mongoose")
const Msg = require('./models/message');  
const mongoDB = "mongodb://localhost:27017";
mongoose.connect(mongoDB, {useNewUrlParser: true}).then(()=> {
  console.log("connected")
} )

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
  Msg.find().then(result => {
    socket.emit("outputMessage", result)  
  })
  console.log("a user connected");
  socket.emit("message", "hello")
  socket.on("disconnect", ()=> {
    console.log("user disconnected")
  })
  socket.on("forum", (value)=> {
    socket.join(value)
  })
  socket.on("chatmessage", (msg) => {
    const message = new Msg({msg}) 
    message.save().then(()=> {
      io.emit("message", msg)
    })
  }) 
})

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/public/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



