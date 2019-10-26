const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const UserModel = require('../../models/user.model');
const configAuth = require('../../config/auth');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const secret_key = '`Mb6XB=9{n9RZjh*';

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret_key
},
    function (jwtPayload, cb) {
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return UserModel.findOneEmail({ email: jwtPayload.email })
            .then(user => {
                if (user.lenght <= 0) {
                    return cb(null, false);
                }
                else {
                    delete user[0].password;
                    return cb(null, user[0]);
                }
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
        return UserModel.findOneLocal({ email, password })
            .then(user => {
                if (!user || user.length <= 0) {
                    return cb(null, false, { message: 'Incorrect email or password.' });
                }
                return cb(null, user[0], { message: 'Logged In Successfully' });
            })
            .catch(err => cb(err, false, { message: 'Something error.' }));
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
},
    function (token, refreshToken, profile, done) {
        process.nextTick(function () {
            UserModel.findOneEmail({ 'email': profile.emails[0].value }).then(user => {
                console.log(user)
                if (user && user.length > 0) {
                    return done(null, user[0]);
                } else {
                    const newUser = { email: profile.emails[0].value, photo: profile.photos[0].value, name: profile.displayName, loginType: 'google', googleId: profile.id };
                    console.log(newUser)
                    UserModel.add(newUser).then((index) => {
                        return done(null, newUser);
                    }).catch((err) => {
                        console.log(err);
                        return done(null, false);
                    });
                }
            }).catch(err => {
                return done(null, false);
            });
        });
    })
);

passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'emails']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    if (profile.emails === undefined || profile.emails.length <= 0) {
        return done(null, false);
    }
    UserModel.findOneEmail({ 'email': profile.emails[0].value }).then(user => {
        console.log(user)
        if (user && user.length > 0) {
            return done(null, user[0]);
        } else {
            const newUser = { email: profile.emails[0].value, photo: profile.photos[0].value, name: profile.displayName, loginType: 'facebook', facebookId: profile.id };
            console.log(newUser)
            UserModel.add(newUser).then((index) => {
                return done(null, newUser);
            }).catch((err) => {
                console.log(err);
                return done(null, false);
            });
        }
    }).catch(err => {
        return done(null, false);
    });
  }
));

