const {
    mongoose
} = require("../EHR/MongoDB/mongoose");

const axios = require("axios");

const {
    Claim
} = require("../EHR/models/claimStatus");

const _ = require("lodash");

let getClientInfo = data => {
    data.Hospital_ID = 'HS12345';
    return new Promise((resolve, reject) => {
        axios
            .post(`http://localhost:4000/getpatient/`, data)
            .then(function (response) {
                if (response.status == 200) resolve(response.data);
                else reject(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    });
};


let getClients = (insurer) => {
    return new Promise((resolve, reject) => {
        let result = {};
        result.clients = [];
        let output = {};
        output.clients = [];
        Claim.find().then(doc => {
            doc.forEach(record => {
                let res = _.find(record.Treatment, {
                    claimStatus: "UNDER PROCESS",
                    insurer: insurer
                })
                if (res != undefined)
                    result.clients.push({
                        AdharNo: record._id
                    });
            })
            result.clients.forEach(client => {
                // console.log(client);
                getClientInfo(client).then(info => {
                    // console.log(info);
                    client.Name = info.firstName + " " + info.lastName;

                    output.clients.push(client);
                    if (result.clients.length == output.clients.length) {
                        delete result;
                        resolve(output);
                    }
                })

            })


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

// let data = {
//     "AdharNo": "8421999884",
//     "Hospital_ID": "HS12345"
// }
// getClientInfo(data).then(doc => {
//     console.log(doc);
// })

module.exports = {
    getClients
}