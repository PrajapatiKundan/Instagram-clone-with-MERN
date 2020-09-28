const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')
const User = mongoose.model('User')

router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user => {
        Post.find({postedBy:req.params.id})
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user, posts})
        })
    })
    .catch(err => res.status(404).json({error:"User Not Found"}))
})

router.put('/follow', requireLogin,(req, res) => {
    const log_user_id = req.user._id//logged User
    const fol_user_id = req.body.follow_id//user to be followed
    //console.log("followId : ", fol_user_id)
    User.findByIdAndUpdate(
        fol_user_id,
        {$push: {followers:log_user_id}},
        {new: true},
        (err, result) => {
            if(err){
                return res.status(422).json({error: err})
            }
            
            User.findByIdAndUpdate(
                log_user_id,
                { $push : { following : fol_user_id}},
                { new: true}
            )
            .select("-password")
            .then( result => {
                res.json(result)
            })
            .catch(err => {
                res.status(422).json({error:err})
            })
        }
    )
})

router.put('/unfollow', requireLogin,(req, res) => {
    const log_user_id = req.user._id//logged User
    const unfol_user_id = req.body.unfollow_id//user to be followed

    User.findByIdAndUpdate(
        unfol_user_id,
        {$pull: {followers:log_user_id}},
        {new: true},
        (err, result) => {
            if(err){
                return res.status(422).json({error: err})
            }
            User.findByIdAndUpdate(
                log_user_id,
                { $pull : { following : unfol_user_id}},
                { new: true}
            )
            .select("-password")
            .then( result => {
                res.json(result)
            })
            .catch(err => {
                res.status(422).json({error:err})
            })
        }
    )
})

router.put('/changeprofile', requireLogin,(req, res) => {
    const picUrl = req.body.picUrl
    User.findByIdAndUpdate(
        req.user._id,
        {$set : { profile_pic: picUrl }},
        {new : true}
    )
    .select("-password")
    .then(result => {
        res.json(result)
    })
    .catch( err => res.status(422).json({error:"Profile not found!"}))
    
})
module.exports = router