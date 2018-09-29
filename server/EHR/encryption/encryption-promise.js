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


let encryptObject = (data, CIPHER_KEY) => {
    return new Promise((resolve, reject) => {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {

                if (key == '$class' || key == 'AdharNo' || key == 'EHR_ID' || key == 'patientData') {

                } else {
                    let val = data[key];
                    encrypt_promise(val, CIPHER_KEY).then((res) => {
                        ReplaceWithCipher(data, key, res).then((res) => {

                        }, (errorMessage) => {

                            console.log(errorMessage);
                            reject(errorMessage);
                        });
                    }, (errorMessage) => {

                        console.log(errorMessage);
                        reject(errorMessage);
                    });
                }
            }
        }
        resolve(data);
    });
}

let ReplaceWithCipher = (data, key, res) => {
    return new Promise((resolve, reject) => {
        if (data == undefined || data == null || key == undefined || key == null || res == undefined || res == null)
            reject('Invalid Input');
        else {
            data[key] = res;
            resolve(data);
        }
    });

}


module.exports = {
    encrypt_promise,
    encryptObject // it takes data and CIPHER KEY and ENCRYPTS IT.
}