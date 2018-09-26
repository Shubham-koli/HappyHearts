const Crypto = require("crypto-js");
let encrypt_promise = (str, key) => {
    return new Promise((resolve, reject) => {
        if (str === null || str === undefined) {
            reject("String is not acceptable");
        } else if (key === null || key === undefined) {
            reject("key is not acceptable");
        } else {
            if (typeof (key) === 'string') {
                let text = Crypto.AES.encrypt(str, key).toString();
                resolve(text);
            } else {
                reject('key is not in string format');
            }
        }
    })
}


module.exports = {
    encrypt_promise
}