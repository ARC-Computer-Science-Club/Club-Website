const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('../controller/sessions.js');

const router = express.Router();


// for parsing application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({extended: false}));

// for parsing cookies
router.use(cookieParser());


// log in user
router.post('/login', (req, res, next) => {
    if ('session' in req.cookies)
    {
        let token = req.cookies['session'];
        session.revoke(token, false)
            .catch(err => {});
    }

    if ('email' in req.body && 'password' in req.body)
    {
        var email = req.body.email;
        var password = req.body.password;

/*
        fb_auth.signInWithEmailAndPassword(email, password)
            .then(user => {
                return session.create(user.uid);
            })
            .then(token => {
                res.cookie('session', token.encoded);
                res.redirect(303, '/');
            })
            .catch(err => {
                next(err);
            });
*/
    }
    else
    {
        next("Email and/or Password were not provided");
    }
});

// sign up user
router.post('/signup', (req, res, next) => {

    if ('session' in req.cookies)
    {
        let token = req.cookies['session'];
        session.revoke(token, false)
            .catch(err => {});
    }

    if ('email' in req.body && 'password' in req.body)
    {
        var email = req.body.email;
        var password = req.body.password;

/*
        fb_auth.signUpWithEmailAndPassword(email, password)
            .then(user => {
                return session.create(user.uid);
            })
            .then(token => {
                res.cookie('session', token.encoded);
                res.redirect(303, '/');
            })
            .catch(err => {
                next(err);
            });
*/
    }
    else
    {
        next("Email and/or Password were not provided");
    }
});


// log out user
router.post('/logout', (req, res, next) => {
    if ('session' in req.cookies)
    {
        var token = req.cookies['session'];
        session.read(token)
            .then((payload) => {
                res.clearCookie('session');
                res.redirect(303, '/');
                session.revoke(token);
            })
            .catch((err) => {
                next(err);
            });
    }
    else
    {
        res.sendStatus(200);
    }
});


// keep at bottom of file
module.exports = router;
