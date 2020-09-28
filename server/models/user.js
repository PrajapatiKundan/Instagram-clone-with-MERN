const mongoose = require('mongoose')
const { DEFAULT_PROFILE_PIC } = require('../keys')

var Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema.Types

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    followers:[{
        type: ObjectId,
        ref: "User"
    }],
    following:[{
        type: ObjectId,
        ref: "User"
    }],
    profile_pic:{
        type:String,
        default: DEFAULT_PROFILE_PIC
    }
})

mongoose.model('User', userSchema)