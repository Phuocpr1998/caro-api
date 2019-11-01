const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserModel = require('../../models/user.model');
const contains = require('../../config/contains');
const imgurUploader = require('imgur-uploader');
const fs = require('fs');

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
    if (req.files !== null && req.files.photo !== undefined && req.files.photo !== null) {
        try {
            let image = req.files.photo;
            var imageName = new Date().getTime();
            var pathFile = imageName.toString();

            image.mv(pathFile, function (err) {
                if (err) {
                    console.log(err);
                    return rep.json({
                        error: err
                    })
                }
                imgurUploader(fs.readFileSync(pathFile))
                    .then((json) => {
                        console.log(json.link);
                        var url_image = json.link;
                        body.loginType = 'local';
                        body.photo = url_image;
                        delete body.point;
                        UserModel.add(body).then((index) => {
                            return res.send({ message: "Register successful." })
                        }).catch((err) => {
                            var errMessage = err.sqlMessage;
                            var exists = err.code.includes("ER_DUP_ENTRY");
                            if (exists) {
                                UserModel.findOneEmailAndNotHaveLoginType(body.email, 'local')
                                    .then(user => {
                                        if (!user || user.length === 0) {
                                            return res.send({
                                                message: "Register fail.",
                                                err: "User already exists."
                                            })
                                        } else {
                                            UserModel.udpate(body).then((index) => {
                                                return res.send({ message: "Register successful." })
                                            }).catch((err) => {
                                                console.log(err);
                                                return res.send({
                                                    message: "Register fail.",
                                                    err: errMessage
                                                })
                                            });
                                        }
                                    }).catch(err => {
                                        console.log(err);
                                        return res.send({
                                            message: "Register fail.",
                                            err: errMessage
                                        })
                                    });
                            } else {
                                return res.send({
                                    message: "Register fail.",
                                    err: errMessage
                                })
                            }
                        });
                    })
                    .catch(function (err) {
                        console.error(err);
                        return res.status(400).json({
                            message: "Register fail.",
                            error: err
                        })
                    });
            });
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({
                message: "Register fail.",
                error: err
            })
        }
    } else {
        return res.json({
            message: "photo not found.",
            error: "photo not found"
        })
    }
});

router.post('/update-photo', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (req.files !== null && req.files.photo !== undefined && req.files.photo !== null) {
        try {
            let image = req.files.photo;
            var imageName = new Date().getTime();
            var pathFile = imageName.toString();

            image.mv(pathFile, function (err) {
                if (err) {
                    console.log(err);
                    return rep.json({
                        error: err
                    })
                }
                imgurUploader(fs.readFileSync(pathFile))
                    .then((json) => {
                        console.log(json.link);
                        var url_image = json.link;
                        const body = {}
                        body.email = req.user.email;
                        body.photo = url_image;
                        UserModel.udpate(body).then((index) => {
                            return res.send({ message: "Update photo successful." })
                        }).catch((err) => {
                            console.log(err);
                            return res.send({
                                message: "Update photo fail.",
                                err: errMessage
                            })
                        });
                    })
                    .catch(function (err) {
                        console.error(err);
                        return res.status(400).json({
                            message: "Update photo fail.",
                            error: err
                        })
                    });
            });
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({
                message: "Update photo fail.",
                error: err
            })
        }
    } else {
        return res.json({
            message: "photo not found.",
            error: "photo not found"
        })
    }
});

router.post('/update', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const body = req.body;
    if (body === undefined || body === null || Object.keys(body).length === 0) {
        return res.status(400).send({ message: "Body must not empty." });
    }
    delete body.password;
    delete body.photo;
    delete body.point;
    body.email = req.user.email;
    UserModel.udpate(body).then((index) => {
        return res.send({ message: "Update successful." })
    }).catch((err) => {
        console.log(err);
        return res.send({
            message: "Update fail.",
            err: err.message
        })
    });
});

router.post('/update-point', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const body = req.body;
    if (body === undefined || body === null || Object.keys(body).length === 0) {
        return res.status(400).send({ message: "Body must not empty." });
    }
    UserModel.udpate({email: req.user.email, point: body.point}).then((index) => {
        return res.send({ message: "Update successful." })
    }).catch((err) => {
        console.log(err);
        return res.send({
            message: "Update fail.",
            err: errMessage
        })
    });
});


module.exports = router;
