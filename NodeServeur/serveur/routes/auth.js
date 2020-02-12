const router = require('express').Router();
const RandomString = require('randomstring');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/User');
const { registerVALIDATION, loginVALIDATION } = require('../validation');

router.post('/register', async (req, res) => {
    //LET'S VALIDATE DATA
    const {error} = registerVALIDATION(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //Checking User already in the db
    const emailEXIST = await User.findOne({email: req.body.email});
    if(emailEXIST) return res.status(406).send('email already used');

    //HASH the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //CREATE a new user
    const user = new User({
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: hashedPassword,
        mailing: req.body.mailing,
        TokenAccount: 'r_'+RandomString.generate(22)
    });

    try {
        user.save();
        res.status(201).send('ok');
    } catch (err) {
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    //LET'S VALIDATE DATA
    const {error} = loginVALIDATION(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking User is in the db
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(406).send('Email or password is wrong');

    //PASSWORD is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(406).send('Email or password is wrong');

    //EMAIL Confirm
    if(user.TokenAccount) return res.status(401).send('Email was not verified');

    //Create and assign token
    const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token);
    res.status(201).send(token);
});

//CONFIRME TokenMail
router.post('/TokenMail', async (req, res) => {
    //Checking User is in the db
    const user = await User.findOne({_id: req.body._id});
    if(!user) return res.status(400).send('Oups, le lien est invalide');
    if(!user.TokenAccount) return res.status(400).send('This Account is already active');

    try {
        const uptdateUser = await User.updateOne({_id: user._id}, {$set: { 'TokenAccount': null } });
        if(uptdateUser.nModified === 0) return res.status(400).send('Oups, le lien est invalide');

        res.send(user.id);
    } catch (err) {
        res.status(400).send(err);
    }
});

//UNCONFIRME user TokenMail
router.post('/ScanDate', async (req, res) => {
    const date = new Date();
    
    const users = await User.deleteMany({
        "Date":
           {
            $lt: date.setHours(date.getHours() - 24)
          },
          "TokenAccount": { $type: 2 }
       });
       res.send(users);
});

module.exports = router;