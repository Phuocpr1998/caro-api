const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../../models/user.model');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const secret_key = '`Mb6XB=9{n9RZjh*';

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : secret_key
    },
    function (jwtPayload, cb) {
        console.log(jwtPayload);
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return UserModel.findOne({email, password})
            .then(user => {
                if (user.lenght <= 0) {
                    return cb(null, false);
                }
                return cb(null, user[0]);
            })
            .catch(err => {
                return cb(err);
            });
    }
));

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    function (email, password, cb) {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        return UserModel.findOne({email, password})
           .then(user => {
               if (!user || user.length <= 0) {
                   return cb(null, false, {message: 'Incorrect email or password.'});
               }
               return cb(null, user[0], {message: 'Logged In Successfully'});
          })
          .catch(err => cb(err));
    }
));
