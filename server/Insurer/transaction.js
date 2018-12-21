const axios = require("axios");
let sample = {
    "$class": "org.example.basic.claimTransaction",
    "contract": "resource:org.example.basic.claimDetails#8421999884+Bajaj",
    "insurer": "resource:org.example.basic.InsurerPolicy#8421999884+Bajaj",
    "AdharNo": "8421999884",
    "HospitalFees": "2",
    "ConsultancyFees": "2",
    "PharmacyFees": "2",
    "AcFees": "2"
};


let acceptClaim = (data) => {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:3000/api/org.example.basic.claimTransaction', sample)
            .then(function (response) {
                if (response.status == 200) {
                    console.log(`claim transaction successfully executed.`);
                    resolve(200);
                } else
                    reject(response.data);
                console.log('');
            })
            .catch(function (error) {
                reject(error);
            });
    })
}

// acceptClaim(sample).then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log(err);
// })

module.exports = {
    acceptClaim
}