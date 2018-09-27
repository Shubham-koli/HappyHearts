require("dotenv").config();
const {
    decryptObject
} = require("./decryption-promise");
const {
    getKey
} = require("../MongoDB/GetKeys");



// let data = {
//     '$class': 'org.example.basic.Patient',
//     AdharNo: '8421999884',
//     firstName: 'U2FsdGVkX19rWlqTuFQTv6sJTgh3LBr5rpdMWhOEw2k=',
//     lastName: 'U2FsdGVkX19WUZolZCFCLz9DAMV/NhGuDseSyT8glgY=',
//     Dob: 'U2FsdGVkX19vaXBrZFT4KdD0G4VeOk7JjYv25rpOWgU=',
//     BloodGroup: 'U2FsdGVkX1+dTu8xMj+68478F2chibGa1t+FvmqsvTE=',
//     Gender: 'U2FsdGVkX18ydT3jYNIDEiGQGG7beWc1yZVsYmXchy4=',
//     address: 'U2FsdGVkX1/H4Cy/zrDSKwD79czOJmlt+ACD8m1FQ14=',
//     pincode: 'U2FsdGVkX19nFiSgLlqmcvabWQ2dxJiYMjL872JJX0I='
// };
let decryptUsingPrivateKey = (data) => {
    return new Promise((resolve, reject) => {
        getKey(data.AdharNo).then((res) => {
            decryptObject(data, res).then((result) => {
                // console.log(result);
                resolve(result);
            });
        })
    })
};

// decryptUsingPrivateKey(data).then((res) => {
//     console.log(res);
// })

module.exports = {
    decryptUsingPrivateKey // It decrypts Data using users private key stored in MongoDB
};