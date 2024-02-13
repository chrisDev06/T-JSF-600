const mongoose = require("mongoose")
const {msgSchema} = require("./models/message")
let Usr = require('./models/user') 
const mongoDB = "mongodb+srv://maximeparisi:4nloXstxn8UHz1L7@cluster0.bbwhcld.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB).then(()=> {
  console.log(" db connected")
})

const MongoClient = require('mongodb').MongoClient

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
  // socket.on('helloServeur', (arg) => {        // connection client <--> serveur
  //   console.log(arg);
  // socket.emit('helloClient', 'connection serveur -> client');  
  // });
})

let room = "general"
let arrayRoom = ["general"]


let Msg = mongoose.model(`${room}`, msgSchema);


io.on('connection', ()=>{
  io.emit("userConnected", "a user connected")
})

io.on("connection", (socket)=> {

  function create_chat(msg){
    room = msg
    Msg = mongoose.model("channels", msgSchema)
      let roomList = new Msg({msg}) 
      roomList.save().then(()=> {
      })
    Msg = mongoose.model(`${room}s`, msgSchema)
    Msg.find({room}).then(result => {
      socket.emit("allMessages", result)  
    })

    arrayRoom.push(room)
    socket.emit("roomName", arrayRoom[arrayRoom.length-1])
    console.log(arrayRoom[arrayRoom.length-1])

    socket.join(room)
    
  }

  function delete_chat(str){
    room = "general"
    MongoClient.connect(mongoDB).then((client) => {

      let connect = client.db("test");
      let collection = connect.collection(`${str}s`);
      collection.drop(); 
      for( i in arrayRoom){
        if(str == arrayRoom[i]){
          arrayRoom.shift(i)
        }
      }
      socket.emit("roomName", "general")
      
    })
  }
  
  socket.on("disconnect", ()=> {            //detection connection user
    io.emit("userDisconnected", "user disconnected")
    console.log("a user disconnected")
  })

  socket.emit("roomName", arrayRoom[arrayRoom.length-1])

  Msg.find().then(result => {
    socket.emit("allMessages", result)  
  })
  
  socket.on("selectChat", (cht) => {
    create_chat(cht) 
  })

  socket.on("deleteChat", (del) => {
    delete_chat(del)
  })

  socket.on("updateChat", (up) => {
    MongoClient.connect(mongoDB).then((client) => {

      let connect = client.db("test");
      let collection = connect.collection(`${room}s`);
      collection.rename(`${up}s`); 
      for( i in arrayRoom){
        if( room == arrayRoom[i]){
          arrayRoom.shift(i)
          arrayRoom.push(up)
        }
      }
      socket.emit("roomName", arrayRoom[arrayRoom.length-1])
      room = up

      
    })
  })

  socket.on("chatmessage", (msg) => {

      Msg = mongoose.model(`${room}s`, msgSchema)

      let message = new Msg({msg}) 
      message.save().then(()=> {
      })
      
      io.to(`${room}s`).emit("message", msg)

  })

  socket.on("/nick", (msg) => {

  })
 
  socket.on("/list", (msg) => {
    if(msg != ""){
      socket.emit("listOfRooms", arrayRoom)
    }
  })
  socket.on("/create", (msg) => {
    create_chat(msg)
  })
  socket.on("/delete", (msg) => {
    delete_chat(msg)
  })
  socket.on("/join", (msg) => {
    room = msg
    socket.join(msg)
    array.puch(msg)
    socket.emit("roomName", arrayRoom[arrayRoom.length-1])
  })
  socket.on("/quit", (msg) => {
    if(msg == null){
      socket.leave(room)
      socket.emit("roomName", arrayRoom[arrayRoom.length-1])
    }
    else{
      socket.leave(msg)
    }
    
  })
  let userList = io.sockets.adapter.rooms.get(room)
  socket.on("/users", (msg) => {
    for(let clientId of userList){
      console.log(id)
    }
  })
  socket.on("/msg", (msg) => {
  
  })

  socket.on("createUser", (msg) => {
    console.log(msg)
    Msg = mongoose.model("channels", msgSchema)
    let roomList = new Msg({msg}) 
    roomList.save().then(()=> {
    }) 
      Msg = mongoose.model(`${room}s`, msgSchema)
  }) 
})


// app.get('/refresh', function(req, res) {
//   console.log("dd")
//   return res.redirect("back");
// });

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/public/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



