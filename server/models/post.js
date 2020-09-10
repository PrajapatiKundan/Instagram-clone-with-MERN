const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const Schema = mongoose.Schema
const postSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    like:[{
        type:ObjectId,
        ref:"User"
    }],
    comments:[{
        text:String,
        postedBy:{type: ObjectId, ref:"User"}
    }],
    photo:{
        type: String,
        required: true
    },
    postedBy:{
        //referencing id of user from User collection
        type: ObjectId,
        ref: "User"
    }
})

mongoose.model('Post', postSchema)