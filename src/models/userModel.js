const { default: mongoose } = require("mongoose")

const userSchema = new mongoose.Schema({

    email : {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password: {
        type:String,
        required:true,
    },
    name: {
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    randomEmailSt:{
        st :{
            type:String,
            required:true
        },
        date : {
            type:Date
        }
    },
    emailVerify:{
        type:Boolean,
        default:false
    },
    randomPassSt:{
        st :{
            type:String,
        },
        date : {
            type:Date
        },
        used :Boolean
    },
    isDeleted:{
        type:Boolean,
        default:false
    }


},{timestamps:true})

module.exports = new mongoose.model("User",userSchema)