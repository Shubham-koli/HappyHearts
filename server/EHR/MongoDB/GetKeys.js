const {
    keyModel
} = require('../models/keyStructure');
const {
    mongoose
} = require("../MongoDB/mongoose");
const {
    saveToDB,
    createPrivateKey
} = require("./storeKey")


let getKey = (AadharNo) => {
    return new Promise((resolve, reject) => {
        if (AadharNo === null || AadharNo === undefined) {
            reject('Aadhar Number is Invalid');
        } else {
            keyModel.findById(AadharNo).then((doc) => {
                // console.log(doc);
                if (!doc) {
                    console.log("record for that Aadhar No doesn't Exists");

                } else {
                    resolve(doc.privateKey);
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    })
}

//This Promise returns Private Key for that particular Aadhar No. if the record is not present it creates a record for it.
// getKey('8421999887').then((doc) => {
//     console.log(doc);
// }, (errorMessage) => {
//     console.log(errorMessage);
// })

module.exports = {
    getKey
}