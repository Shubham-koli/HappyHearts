const {
    mongoose
} = require("../EHR/MongoDB/mongoose");

const {
    Claim
} = require("../EHR/models/claimStatus");

const _ = require("lodash");

let getClients = (insurer) => {
    return new Promise((resolve, reject) => {
        let result = [];
        Claim.find().then(doc => {
            doc.forEach(record => {
                let res = _.find(record.Treatment, {
                    claimStatus: "UNDER PROCESS",
                    insurer: insurer
                })
                result.push(record._id);
            })
            result = _.compact(result)
            resolve(result)
        }).catch(err => {
            reject(err);
        })
    })
}

// getClients('Bajaj').then(result => {
//     console.log(result);
// }).catch(err => {
//     console.log(err);
// })


module.exports = {
    getClients
}