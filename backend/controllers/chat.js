const mongoose = require("mongoose")
const Msg = require('../models/message'); 
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

io.on("connection", (socket)=> {
  console.log("testa")
    socket.on("createChat", () => {
      
        let MongoClient = require("mongodb").MongoClient
        MongoClient.connect(mongoDB, function (client) {
          let db = client.db("mydb")
          db.createCollection("chat", function () {
            const message = new Msg({"tata":any})
            client.close()
          })
        })
    })
})

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/public/index.html'));
  });
  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });