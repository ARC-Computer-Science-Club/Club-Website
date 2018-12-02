const request = require('request');


// request promisified
module.exports = function rp (options) {
    return new Promise((resolve, reject) => {
        request.call(null, options, (err, res, body) => {
            if (err)
            { // failure
                reject(err);
            }
            else
            { // success
                // Promise returns res and body object
                resolve({res: res, body: body});
            }
        });
    });
};
