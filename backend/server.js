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
    socket.join(room)
    
  }

  function delete_chat(str){
    room = "generale"
    MongoClient.connect(mongoDB).then((client) => {

      let connect = client.db("test");
      let collection = connect.collection(`${str}s`);
      collection.drop(); 
      
    })
  }

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
      room = up
      
    })
  })



  socket.on("chatmessage", (msg) => {

    let tmp= msg.split(" ")
    let tmp2 = msg.split("")

    const commands = {
      "/nick" : "nick",
      "/list" : "list",
      "/create" : "create",
      "/delete" : "delete",
      "/join" : "join",
      "/quit" : "quit",
      "/users" :"users",
      "/msg" : "msg"
    }

    if(tmp2[0]== "/"){
      for (let key in commands){
        if(tmp[0] === key){
          socket.emit(commands, tmp[0]) 
        }
      }
    }
    else{
     
      Msg = mongoose.model(`${room}s`, msgSchema)

      let message = new Msg({msg}) 
      message.save().then(()=> {
      })

      // fetch('http://localhost:3001/refresh', { 
      //   method: 'GET'
      // }).then(response => {
      //     // console.log(response)
      //     if (!response.ok) {
      //         throw new Error('Erreur lors de la requête');
      //     }

      //     return response.text();
      // })

      
      io.to(`${room}s`).emit("message", msg)
    }

  })

  socket.on("/nick", (msg) => {

  })
  socket.on("/list", (msg) => {
    if(msg == "")
    Msg = mongoose.model(`channels`, msgSchema)
    Msg.find().then(result => {
      socket.emit("allMessages", result)
    })
  })
  socket.on("/create", (msg) => {
    create_chat(msg)
  })
  socket.on("/delete", (msg) => {
    delete_chat(msg)
  })
  socket.on("/join", (msg) => {
    create_chat(msg)
  })
  socket.on("/quit", (msg) => {
    create_chat("generale")
  })
  socket.on("/users", (msg) => {

  })
  socket.on("/msg", (msg) => {
  
  })

//   socket.on("createUser", (usr) => {
//     const user = new Usr({usr})    
//   }) 
})


app.get('/refresh', function(req, res) {
  console.log("dd")
  return res.redirect("back");
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/public/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



