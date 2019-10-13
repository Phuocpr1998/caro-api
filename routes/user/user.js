const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const secret_key = '`Mb6XB=9{n9RZjh*';
/* POST login. */
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({
                message: info.message,
                user   : user
            });
        }
       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
           // generate a signed son web token with the contents of user object and return it in the response
           const token = jwt.sign(user, secret_key);
           return res.json({token});
        });
    })(req, res);
});

router.get('/profile', function (req, res, next) {
    res.send("ok");
});

module.exports = router;
