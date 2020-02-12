const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const expressip = require('express-ip');
//const RandomString = require('randomstring');

dotenv.config();

//Connect to DB
mongoose.connect( process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to db !')
);

//Import Routes
const authRoute = require('./routes/auth');
const VerifyConnect = require('./routes/verifyToken');

//MiddLeware
app.use(expressip().getIpInfoMiddleware);
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, auth-token');
    res.header("Access-Control-Expose-Headers", "auth-token");
    next();
});

let ProjectJson = {
    _id: '127-268-bfg',
    name: 'Mon Petit Projet',
    _ico: null,
    users: {
      Total:[],
      Online:[],
    },
    data:{
      files:24,
      folders:18,
      storage:162186 //en octets
    },
  }

let otherProjects = {
    Owner:'Popole',
    Projects:[ProjectJson]
}

//Route MiddLewares
app.use('/api/user', authRoute);
app.listen(8080);