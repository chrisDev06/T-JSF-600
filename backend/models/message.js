const mongoose= require("mongoose")
const { Server } = require('socket.io');
const { room } = require("../server")


let msgSchema = new mongoose.Schema({
    msg:{
        type:String,
        require: true
    }
    })
    
    let Msg = mongoose.model(`${room}`, msgSchema);
    console.log(room)
    module.exports= Msg;

    
