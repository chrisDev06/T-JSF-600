const mongoose= require("mongoose")
const chtSchema = new mongoose.Schema({
    cht:{
        type:String,
        require: true
    }
})

const Cht = mongoose.model("cht", chtSchema);
module.exports= Cht;