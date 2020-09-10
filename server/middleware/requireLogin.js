
const mongoose = require('mongoose')
const User = mongoose.model('User')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('../keys')

module.exports = (req, res, next) => {
    const { authorization } = req.headers//aithorizaion contains token

    if(!authorization){
        return res.status(401).json({ error : "You must logged in first!"})
    }
    const token = authorization.replace("Bearer ", "")
    //decoding of token into payload
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
        //token string -> {_id:_id of user} that is payload
        if(error){
            return res.status(401).json({ error : "You must logged in first!"})
        }

        const { _id } = payload
        User.findById(_id)
        .then( userData => {
            req.user = userData
            next()
        })
    })

}