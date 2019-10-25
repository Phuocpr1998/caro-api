var db = require('./db');

module.exports = {
    findOneLocal: (user) => {
        return db.load(`select * from USERS where email = '${user.email}' and password = '${user.password}'`);
    },
    findOneEmail: (user) => {
        return db.load(`select * from USERS where email = '${user.email}'`);
    },
    add: (user) => {
        return db.add(`USERS`, user);
    }
}