const jwt = require ('jsonwebtoken');

// jsonwebtoken sign promisified
module.exports.asyncSign = function asyncSign (payload, secret, options) {
    return new Promise((resolve, reject) => {
        try {
            var token = jwt.sign(payload, secret, options);
        }
        catch (err) {
            reject(err);
        }
        resolve(token);
    });
};


// jsonwebtoken verify promisified
module.exports.asyncVerify = function asyncVerify (token, secret, options) {
    return new Promise((resolve, reject) => {
        try {
            var payload = jwt.verify(token, secret, options);
        }
        catch (err) {
            reject(err);
        }
        resolve(payload);
    });
};


// jsonwebtoken decode promisified
module.exports.asyncDecode = function asyncDecode (token, options) {
    return new Promise((resolve, reject) => {
        try {
            var payload = jwt.decode(payload, options);
        }
        catch (err) {
            reject(err);
        }
        resolve(payload);
    });
};
