require("dotenv").config();
const decrypt = require("./decryption-promise");
const Crypto = require("crypto-js");
const FABRIC_KEY = process.env.FABRIC_KEY;

let data = {
    '$class': 'org.example.basic.Patient',
    AdharNo: '1234',
    firstName: 'U2FsdGVkX19gHkmbVGpTbVxvFOUbhHFpG5NUUoxnyVU=',
    lastName: 'U2FsdGVkX19R1hHAqS2x9hmQMbdMKTk0GGOtPMiBLJo=',
    Dob: 'U2FsdGVkX1+P95reW74sOdZ2QcCOvEGSkrLe6+Rh+7k=',
    BloodGroup: 'U2FsdGVkX1+4+k4yuroSyv1/UBdvfHvTj3QnDDnywMY=',
    Gender: 'U2FsdGVkX1+tXK7usTDMc7ZEgnul7WpBgG5fdquEWQQ=',
    address: 'U2FsdGVkX19Wa/kmYikTpK4I+ttfDvR6OdF0IvcCN78=',
    pincode: 'U2FsdGVkX1+6cNNDbZh3jfzxsKjRe6R73qgQeOlGwTc='
}
decrypt.decryptObject(data, FABRIC_KEY).then((res) => {
    console.log(res);
}, (err) => {
    console.log(err);
});