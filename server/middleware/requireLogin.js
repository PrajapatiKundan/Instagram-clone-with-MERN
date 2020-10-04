const mongoose = require('mongoose')
const User = mongoose.model('User')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('../keys')

module.exports = (req, res, next) => {
    //authorizaion contains token
    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({ error : "You must logged in first!"})
    }
    const token = authorization.replace("Bearer ", "")

    //decoding of token into payload
    try{
        if(token){
            const decode = jwt.verify(token, JWT_SECRET_KEY)
            const { _id } = decode
            
            User.findById(_id)
                .then( userData => {
                    req.user = userData
                    next()
                })
        }
    }catch(err){
        res.status(401).json({error:"Token is not valid"})
    }
}



    // jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
    //     //token string -> {_id:_id of user} that is payload
        
    //     try {
    //         if(!error){
    //             const { _id } = payload
    //             User.findById(_id)
    //             .then( userData => {
    //                 req.user = userData
    //                 next()
    //             })
    //         }else{
    //             res.status(400).json({ error : "You have to logged in first!"})
    //             throw new Error(error)
    //         }
    //     }catch (error){
    //         console.log("ERROR => ", error)
    //     }
        

        
    // })



