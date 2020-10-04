const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('../keys')


router.post('/signup', (req, res) => {
    const { name, email, password } = req.body

    if(!email || !name || !password){
        return res.status(422).json({error : "Please fill all the fields"})
    }
    //check whether the user already exist or not
    User.findOne({ email : email})
        .then( savedUser => {
            if( savedUser ){
                return res.status(422).json({error : "User is already exists with this email"})
            }

            bcrypt.hash(password, 12)  //12 is just the saltRound
                .then( hashedPassword => {
                    const user = new User({
                        name,
                        email,
                        password:hashedPassword
                    })
            
                    user.save()
                        .then( user =>{
                            res.json({msg:"user saved successfully!"})
                        })
                        .catch( err => {
                            console.log(err);
                        })
                })
        })
        .catch( err => {
            console.log(err);
        })
})

router.post('/signin', (req, res)=> {
    const { email, password } = req.body
    
    if(!email || !password){
        return res.status(422).json({ error : "Please fill all the fields!"})
    }

    User.findOne({ email: email})
        .then( savedUser => {
            if(!savedUser){
                return res.status(422).json({ error : "Invalid email or password"})
            }
            
            bcrypt.compare(password, savedUser.password)
                  .then( match => {
                      if(match){
                          const token = jwt.sign({ _id: savedUser._id}, JWT_SECRET_KEY)
                          const { _id, name, email, followers, following, profile_pic } = savedUser
                          
                          res.json({ token, user:{_id, name, email, followers, following, profile_pic}})
                      }else{
                          return res.status(422).json({ error : "Invalid email or password"})
                      }
                  })
                  .catch( err => {
                      console.log(err)
                  })
        }) 
})


module.exports = router