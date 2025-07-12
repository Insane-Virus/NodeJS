require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
    origin: '*',
    credentials:true,
}));
//connecting mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

app.use(express.json());


//using routes
const userRoute = require('./routes/user_route');

app.use('/users',userRoute);


app.listen(process.env.PORT,()=>{
    console.clear();
    console.log(`Node Server running at port ${process.env.PORT}`);
})

/*
const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:4200'],
    credentials:true,
}));

const helmet - require('helmet');
app.use(helmet()):

const ratelimit = require('express-rate-limit');
const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max:5,
    message:{error:'Too many login attempts. Try again in 1 minute.'},
    standardHeaders: true,
    legacyHeaders:false,
}),
app.use('/login',loginLimiter);

const apiLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    message:{error:'Too many requests. Please try again later.'},
});
app.use('/api',apiLimiter);
*/