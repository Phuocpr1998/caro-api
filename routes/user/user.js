const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserModel = require('../../models/user.model');

const secret_key = '`Mb6XB=9{n9RZjh*';

/* POST login. */
router.post('/login', passport.authenticate('local', {session: false}), function (req, res, next) {
   console.log(req.user);
   res.json({token: jwt.sign(Object.assign({}, req.user), secret_key)});
});

router.post('/register', function(req, res, next) {
    const body = req.body;
    if (body === undefined || body === null || Object.keys(body).length === 0) {
        return res.status(400).send({message: "Body must not empty."});
    }
    UserModel.add(body).then((index) => {
        return res.send({message: "Register successful."})
    }).catch((err) => {
        console.log(err);
        var errMessage = err.sqlMessage;
        var exists = err.code.includes("ER_DUP_ENTRY");
        if (exists) {
            return res.send({
                message: "Register fail.",
                err: "User already exists."
            })
        }

        return res.send({
            message: "Register fail.",
            err: errMessage
        })
    });
});

module.exports = router;
