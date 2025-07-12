const JWT = require('../utilities/jwt');
const redisCache = require('./redis_cache');
const userDB = require('../models/user_model');

const authenticate = async (req, res, next) => {
    //console.log("===Authenticating===",req.headers.authorization,"==body==",req.body);
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401). json({ error: 'No token provided.' });
    }
    try {
        const decoded = JWT.verify(authHeader.split(' ')[1]);
        const curUser = await redisCache.get(`${decoded.userId}`);
        if (!curUser) {
            let dbUser = await userDB.findById(decoded.userId);
            if (!dbUser) {
                res.status(403).json({ error: 'No user found with that token' });
            }
            await redisCache.set(`${decoded.userId}`,dbUser);
            //console.log("new redis entry");
            req.currentUser = dbUser;
        }else{
            await redisCache.expire(`${decoded.userId}`);
            req.currentUser = curUser;
        }
        //console.log(req.currentUser);
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
}

module.exports = {
    authenticate
}