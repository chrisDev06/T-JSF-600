const mongoose = require("mongoose")
const Msg = require("./models/message")
const Usr = require('./models/user') 
const mongoDB = "mongodb+srv://maximeparisi:4nloXstxn8UHz1L7@cluster0.bbwhcld.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB).then(()=> {
  console.log(" db connected")
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
  socket.on('helloServeur', (arg) => {        // connection client <--> serveur
    console.log(arg);
  socket.emit('helloClient', 'connection serveur -> client');  
  });
  console.log("a user connected");
  socket.on("disconnect", ()=> {            //detection connection user
    console.log("user disconnected")
  })
});


io.on("connection", (socket)=> {


  let room = "generale"
  
  
  socket.on("chat", (cht) => {
    socket.join(cht)
    room = cht
    module.exports = {
      room: room
  }
  })

  Msg.find().then(result => {
    socket.emit("outputMessage", result)  
  })

  socket.on("chatmessage", (msg) => {
    const message = new Msg({msg}) 
    message.save().then(()=> {
      io.to(room).emit("message", msg)
    })
  })

  socket.on("user", (usr) => {
    const user = new Usr({usr})    
  }) 
})

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/public/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



