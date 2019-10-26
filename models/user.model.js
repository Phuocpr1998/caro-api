var db = require('./db');

module.exports = {
    findOneLocal: (user) => {
        return db.load(`select * from USERS where email = '${user.email}' and password = '${user.password}'`);
    },
    findOneEmail: (user) => {
        return db.load(`select * from USERS where email = '${user.email}'`);
    },
    findOneEmailAndNotHaveLoginType: (user, loginType) => {
        return db.load(`select * from USERS where email = '${user.email}' and loginType <> '${loginType}'`);
    },
    add: (user) => {
        return db.add(`USERS`, user);
    },
    udpate: (user) => {
        return db.update(`USERS`, user, 'email');
    }
}