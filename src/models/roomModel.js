const { default: mongoose } = require("mongoose")

const roomSchema = new mongoose.Schema({

    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    users:[mongoose.Schema.Types.ObjectId],
    active:Boolean,
    code: String,
    isDeleted:{
        type:Boolean,
        default:false
    }


},{timestamps:true})

module.exports = new mongoose.model("Room",roomSchema)