const mongoose = require("mongoose")
const Msg = require('./models/message'); 
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

io.on("connection", (socket)=> {
    socket.on("createChat", () => {
        
    })
})

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/public/index.html'));
  });
  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });