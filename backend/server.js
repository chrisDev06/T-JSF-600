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
  socket.on('helloServeur', (arg) => {        // connection client <--> serveur
    console.log(arg);
  socket.emit('helloClient', 'connection serveur -> client');  
  });
  console.log("a user connected");
  socket.on("disconnect", ()=> {            //detection connection user
    console.log("user disconnected")
  })
});

let room = "generale"

let Msg = mongoose.model(`${room}`, msgSchema);


io.on("connection", (socket)=> {

  Msg.find().then(result => {
    socket.emit("allMessages", result)  
  })
  
  socket.on("selectChat", (cht) => {
    room = cht
    Msg = mongoose.model(`${room}s`, msgSchema)
    Msg.find().then(result => {
      socket.emit("allMessages", result)  
    })
    socket.join(cht) 
  })

  socket.on("updateChat", (up) => {
    room = up
    MongoClient.connect(mongoDB).then((client) => {

      const connect = client.db("test");
      const collection = connect.collection(`${room}s`);
      collection.rename(`${up}s`); 
      console.log(room) 
      
    })
  })

  socket.on("deleteChat", (del) => {
    room = "generale"
    MongoClient.connect(mongoDB).then((client) => {

      const connect = client.db("test");
      const collection = connect.collection(`${del}s`);
      collection.drop(); 
      
    })
  })

  socket.on("chatmessage", (msg) => {

    let tmp= msg.split(" ")
    let tmp2 = msg.split("")
    const commands = {
      "/nick" : () => {console.log("/nick")},
      "/list" : () => {console.log("/list")},
      "/create" : () => {console.log("/create")},
      "/delete" : () => {console.log("/delete")},
      "/join" : () => {console.log("/join")},
      "/quit" : () => {console.log("/quit")},
      "/users" : () => {console.log("/users")},
      "/msg" : () => {console.log("/msg")}
    }

    if(tmp2[0]== "/"){
      for (let key in commands){
        if(tmp[0] === key){
          console.log(commands[key])
          commands[key];
        }
      }
    }
    else{
      Msg = mongoose.model(`${room}s`, msgSchema)
      const message = new Msg({msg}) 
      message.save().then(()=> {
      })
      var livereload = require("livereload");
      var connectLiveReload = require("connect-livereload");

      const liveReloadServer = livereload.createServer();
      liveReloadServer.server.once("connection", () => {
      liveReloadServer.refresh("/");

      app.use(connectLiveReload());
    });
      io.to(`${room}s`).emit("message", msg)
    }
  })

  socket.on("createUser", (usr) => {
    const user = new Usr({usr})    
  }) 
})

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/public/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



