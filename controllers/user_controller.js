const userDB = require('../models/user_model');
const redisCache = require('../utilities/redis_cache');
const bcrypt = require('bcryptjs');
const JWT = require('../utilities/jwt');
const { joiUserSchemaLogin, joiUserSchemaRegister } = require('../utilities/joi_user_schema');
const { SuccessOK, SuccessCreated, SuccessAccepted, SuccessNoContent, CEUnauthorized, CEBadRequest } = require('../utilities/respond_messages');

const login = async (req, res, next) => {
    req.body.name = req.body.name.toLowerCase();
    const { error, value } = joiUserSchemaLogin.validate(req.body);
    if (error) return CEBadRequest(res, "Invalid Format", error.details[0].message);

    let { name, password } = value;
    try {
        let dbUser = await userDB.findOne({ name });
        if (!dbUser) {
            throw new Error('User not found with that credentials');
        }
        const valid = await bcrypt.compareSync(password, dbUser.password);
        if (!valid) {
            throw new Error('Credential Error');
        }
        const token = JWT.createToken({ userId: dbUser._id });
        SuccessOK(res, dbUser.role, { token });
    } catch (error) {
        CEUnauthorized(res, error.message);
    }
}

const register = async (req, res, next) => {
    req.body.role = (req.currentUser.role == 'admin') ? 'agent' : 'user';
    req.body.parent = req.currentUser.id;
    if (req.body.units > req.currentUser.units) {
        return CEBadRequest(res, "Insufficient Balance", {});
    }
    let { error, value } = joiUserSchemaRegister.validate(req.body);
    if (error) return CEBadRequest(res, "Invalid Format", error.details[0].message);


    let { name, password } = value;
    try {
        let dbUser = await userDB.findOne({ name });
        if (dbUser) {
            throw new Error('Username already used');
        }
        const hashPassword = await bcrypt.hashSync(password, 10);
        value.password = hashPassword;
        const user = await new userDB(value).save();
        await exchangeBalance(req.currentUser._id, user.units, false);
        await redisCache.delete(req.currentUser._id.toString());
        SuccessCreated(res, `New ${(req.currentUser.role == 'admin') ? 'agent' : 'user'} Created`, {id:user._id});
    } catch (error) {
        console.log(error);
        CEBadRequest(res, error.message);
    }
}

const profile = async (req, res, next) => {
    try {
        let dbUser = await userDB.findOne({ _id: req.currentUser._id }).populate('children');
        if (!dbUser) {
            throw new Error('User not found with that credentials');
        }
        SuccessOK(res, "User Found", dbUser);
    } catch (error) {
        console.log(error);
        CEUnauthorized(res, error.message);
    }
}
const exchangeBalance = async (id, value, isAdding) => {
    if (isAdding) {
        await userDB.findByIdAndUpdate(
            id,
            { $inc: { units: value } },
            { new: true }
        )
    } else {
        await userDB.findByIdAndUpdate(
            id,
            { $inc: { units: -value } },
            { new: true }
        )
    }
}

const fund = async (req, res, next) => {
    if (req.body.units > req.currentUser.units) {
        return CEBadRequest(res, "Insufficient Balance.", {});
    } else if (req.body.units < 1) {
        return CEBadRequest(res, "Funding must be > 0.", {});
    }
    try {
        await exchangeBalance(req.currentUser._id, req.body.units, false);
        await redisCache.delete(req.currentUser._id.toString());
        await exchangeBalance(req.body.id, req.body.units, true);
        SuccessCreated(res, `Funded ${(req.currentUser.role == 'admin') ? 'agent' : 'user'}`, {});
    } catch (error) {
        console.log(error);
        CEBadRequest(res, error.message);
    }
}

module.exports = {
    login,
    register,
    profile,
    fund
}