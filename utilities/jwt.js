const jwt = require('jsonwebtoken');

const JWT = {
    createToken:(payload)=> jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.JWT_LIFE }),
    verify:(token)=>jwt.verify(token,process.env.SECRET_KEY)
}

module.exports = JWT;