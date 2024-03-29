const Crypto = require("crypto-js");

let decrypt_promise = (str, key) => {
  return new Promise((resolve, reject) => {
    if (str === null || str === undefined) {
      reject("String is not acceptable");
    } else if (key === null || key === undefined) {
      reject("key is not acceptable");
    } else {
      if (typeof key === "string") {
        let text = Crypto.AES.decrypt(str, key).toString(Crypto.enc.Utf8);
        resolve(text);
      } else {
        reject("key is not in string format");
      }
    }
  });
};

let decryptObject = (data, CIPHER_KEY) => {
  return new Promise((resolve, reject) => {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (key == "$class" || key == "AdharNo" || key == "EHR_ID") {
        } else {
          let val = data[key];
          decrypt_promise(val, CIPHER_KEY).then(
            res => {
              ReplaceWithCipher(data, key, res).then(
                res => {},
                errorMessage => {
                  console.log(errorMessage);
                  reject(errorMessage);
                }
              );
            },
            errorMessage => {
              console.log(errorMessage);
              reject(errorMessage);
            }
          );
        }
      }
    }
    resolve(data);
  });
};

let ReplaceWithCipher = (data, key, res) => {
  return new Promise((resolve, reject) => {
    if (
      data == undefined ||
      data == null ||
      key == undefined ||
      key == null ||
      res == undefined ||
      res == null
    )
      reject("Invalid Input");
    else {
      data[key] = res;
      resolve(data);
    }
  });
};

module.exports = {
  decrypt_promise,
  decryptObject,
  ReplaceWithCipher
};
