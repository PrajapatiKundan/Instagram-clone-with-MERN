const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const User = mongoose.model('User')
const requireLogin = require('../middleware/requireLogin')

//populate() method populate all the field value of the user.
router.get('/allpost',requireLogin, (req, res) => {
    Post.find()
    .populate("postedBy", "_id name profile_pic")
    .populate("comments.postedBy", "_id name profile_pic")
    .then( posts => {
        res.json({ posts })
    })
    .catch( err => console.log(err))
})

//show the subscribed users' posts only
router.get('/subscribeduserposts',requireLogin, (req, res) => {
    Post.find({ postedBy : { $in : req.user.following}})
    .populate("postedBy", "_id name profile_pic")
    .populate("comments.postedBy", "_id name profile_pic")
    .then( posts => {
       return res.json({ posts })
    })
    .catch( err => console.log(err))
})

router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, pic } = req.body
    if(!title || !body || !pic){
        return res.status(422).json({ error: "Please fill all the fields"})
    }
    //console.log("User Detail : ", req.user)
    req.user.password = undefined//so that in postedBy the password can not be accessed
    const post = new Post({
        title,
        body,
		photo:pic,//pic is a url of cloudinaty where img has been stored
        postedBy: req.user
    })
    post.save()
    .then( result => res.json({ post: result }))
    .catch( err => console.log(err))
})

router.get('/mypost', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id})
    .populate("postedBy", "_id name")
    .then( myposts => res.json({ myposts }))
    .catch( err => console.log(err))
})

router.put('/like', requireLogin,(req, res)=>{
    //findByIdAndUpdate(id, update, options, callback) // executes
    Post.findByIdAndUpdate(
        req.body.postId,
        { $push:{like: req.user._id} },
        { new: true}
    )
    .populate("postedBy", "_id name profile_pic")
    .populate("comments.postedBy", "_id name profile_pic")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }else{
            res.json(result)
        }
    })
})
router.put('/unlike', requireLogin,(req, res)=>{
    //findByIdAndUpdate(id, update, options, callback) // executes
    Post.findByIdAndUpdate(
        req.body.postId,
        { $pull:{like: req.user._id} },
        { new: true}
    )
    .populate("postedBy", "_id name profile_pic")
    .populate("comments.postedBy", "_id name profile_pic")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment', requireLogin, (req, res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }

    Post.findByIdAndUpdate(
        req.body.postId,
        { $push:{comments:comment} },
        { new: true }
    )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then( result => {
                res.json(result)
            })
            .catch( err => console.log(err))
        }
    })
})
router.delete('/deletecomment/:postId/:commentId', requireLogin,(req, res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id")
    .populate("comments.postedBy", "_id")
    .exec((err, post) => {
        if(err || !post){
            return res.status(422).json({error:err})
        }
        post.comments.pull({_id:req.params.commentId})
        post.save((err, result) => {
            if(err){
                return res.status(422).json({error:err})
            } else {                
                res.json(result)
            }
        })
    }) 
})

module.exports = router