var db = require('./db');

module.exports = {
    findOne: (user) => {
        return db.load(`select * from USERS where email = '${user.email}' and password = '${user.password}'`);
    },
    add: (user) => {
        return db.add(`USERS`, user);
    }
}