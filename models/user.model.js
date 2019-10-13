var db = require('./db');

module.exports = {
    findOne: (user) => {
        return new Promise((resolve, reject)=>{
            resolve(user);
        });
    }
}