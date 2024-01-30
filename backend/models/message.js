const mongoose= require("mongoose")
const { Server } = require('socket.io');


let msgSchema = new mongoose.Schema({
    msg:{
        type:String,
        require: true
    }
    })

    module.exports=
     {
        msgSchema: msgSchema
    }





    
