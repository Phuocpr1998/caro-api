const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserModel = require('../../models/user.model');
const contains = require('../../config/contains');

const secret_key = '`Mb6XB=9{n9RZjh*';

/* POST login. */
router.post('/login', passport.authenticate('local', { session: false }), function (req, res, next) {
    delete req.user.password;
    res.json({ token: jwt.sign(Object.assign({}, req.user), secret_key) });
});

router.get('/login-google', passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));
router.get('/login-google/callback',
    passport.authenticate('google', {
        session: false
    }), function (req, res, next) {
        if (!req.user) {
            res.status(401).json({ message: "Login with google fail" });
        } else {
            const token = jwt.sign(Object.assign({}, req.user), secret_key);
            res.redirect(`${contains.FrontendHost}/social-auth/${token}`);
        }
    }
);

router.get('/login-facebook', passport.authenticate('facebook', { session: false, scope: ['email'] }));
router.get('/login-facebook/callback',
    passport.authenticate('facebook', {
        session: false
    }), function (req, res, next) {
        if (!req.user) {
            res.status(401).json({ message: "Login with facebook fail" });
        } else {
            const token = jwt.sign(Object.assign({}, req.user), secret_key);
            res.redirect(`${contains.FrontendHost}/social-auth/${token}`);
        }
    }
);


router.post('/register', function (req, res, next) {
    const body = req.body;
    if (body === undefined || body === null || Object.keys(body).length === 0) {
        return res.status(400).send({ message: "Body must not empty." });
    }
    body.loginType = 'local';
    UserModel.add(body).then((index) => {
        return res.send({ message: "Register successful." })
    }).catch((err) => {
        var errMessage = err.sqlMessage;
        var exists = err.code.includes("ER_DUP_ENTRY");
        if (exists) {
            UserModel.findOneEmailAndNotHaveLoginType(
                {
                    'email': body.email,
                    'loginType': 'local'
                }).then(user => {
                    console.log(user);
                    if (user && user.length > 0) {
                        return res.status(400).send({
                            message: "Register fail.",
                            err: "User already exists."
                        })
                    } else {
                        UserModel.udpate(body).then((index) => {
                            return res.send({ message: "Register successful." })
                        }).catch((err) => {
                            console.log(err);
                            return res.status(400).send({
                                message: "Register fail.",
                                err: errMessage
                            })
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    return res.status(400).send({
                        message: "Register fail.",
                        err: errMessage
                    })
                });
        } else {
            return res.status(400).send({
                message: "Register fail.",
                err: errMessage
            })
        }
    });
});

module.exports = router;
