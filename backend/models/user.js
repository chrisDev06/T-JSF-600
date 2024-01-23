const mongoose= require("mongoose")
const usrSchema = new mongoose.Schema({
    usr:{
        type:String,
        require: true
    }
})

const Usr = mongoose.model("usr", usrSchema);
module.exports= Usr;