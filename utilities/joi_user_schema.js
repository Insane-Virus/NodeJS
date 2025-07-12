const JOI = require('joi');
const mongoose = require('mongoose');

const joiUserSchemaRegister = JOI.object({
    name: JOI.string()
        .pattern(/^[a-z0-9]{5,10}$/)
        .required()
        .messages({
            'string.pattern.base': 'Username must be 5-10 lowercase without space',
            'string.empty': 'Username is required',
        }),
    password: JOI.string()
        .min(8)
        .max(16)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.max': 'Passwrod must be 16 characters at most',
            'string.empty': 'Password is required',
        }),
    role: JOI.string()
        .valid('admin', 'agent', 'user')
        .required(),

    parent: JOI.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .when('role', {
            is: JOI.valid('agent', 'user'),
            then: JOI.required(),
            otherwise: JOI.forbidden()
        }),

    units: JOI.number()
        .min(0)
        .default(0)
});

const joiUserSchemaLogin = JOI.object({
    name: JOI.string()
        .pattern(/^[a-z][a-z0-9]{4,9}$/)
        .required()
        .messages({
            'string.pattern.base': 'Username must be 5-10 lowercase without space',
            'string.empty': 'Username is required',
        }),
    password: JOI.string()
        .min(8)
        .max(16)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.max': 'Passwrod must be 16 characters at most',
            'string.empty': 'Password is required',
        }),

});
module.exports = { joiUserSchemaRegister, joiUserSchemaLogin };