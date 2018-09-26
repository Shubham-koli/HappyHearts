require("dotenv").config();
const Crypto = require("crypto-js");
//const color = require("colors/safe");

const FABRIC_KEY = process.env.FABRIC_KEY;

console.log(FABRIC_KEY);

// let encrypted_text = Crypto.AES.encrypt('shubham', FABRIC_KEY).toString();

// console.log(encrypted_text);

// let decrypted_text = Crypto.AES.decrypt(encrypted_text, FABRIC_KEY).toString(Crypto.enc.Utf8);

// console.log(decrypted_text);


//Encryption Promise
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

encrypt_promise('shubham', FABRIC_KEY).then((res) => {
    console.log(res)
}, (errorMessage) => {
    console.log(errorMessage);
}).catch((err) => {
    console.log('something went wrong in encryption phase');
});