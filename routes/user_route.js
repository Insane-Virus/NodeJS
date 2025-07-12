const express = require('express');
const router = express.Router();
const Controller = require('../controllers/user_controller');
const {authenticate} = require('../utilities/token_authentication');

router.post('/login',Controller.login);
router.post('/register',authenticate,Controller.register);
router.get('/profile',authenticate,Controller.profile);
router.patch('/fund',authenticate,Controller.fund);

module.exports = router;