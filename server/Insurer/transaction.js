const axios = require("axios");

const {
    mongoose
} = require("../EHR/MongoDB/mongoose");

const {
    Claim
} = require("../EHR/models/claimStatus");


let sample = {
    AdharNo: "8421999884",
    TransactionID: "977a5bf50b15a709020ca66e679acced498a87903e6084f7b092cdf7d855b828",
    insurerName: "Bajaj",
    body: {
        "$class": "org.example.basic.claimTransaction",
        "contract": "resource:org.example.basic.claimDetails#8421999884+Bajaj",
        "insurer": "resource:org.example.basic.InsurerPolicy#8421999884+Bajaj",
        "AdharNo": "8421999884",
        "HospitalFees": "2",
        "ConsultancyFees": "2",
        "PharmacyFees": "2",
        "AcFees": "2"
    }
};


let acceptClaim = (data) => {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:3000/api/org.example.basic.claimTransaction', data.body)
            .then(function (response) {
                if (response.status == 200) {
                    console.log(`claim transaction successfully executed.`);
                    // GrantClaim(data.AdharNo, data.TransactionID, data.insurerName).then(doc => {
                    //     console.log('MongoDB record Updated');
                    // }).catch(err => {
                    //     console.log('MongoDB record failed to update');
                    //     console.log(err);
                    // })
                    resolve(200);

                } else
                    reject(response.data);

            })
            .catch(function (error) {
                reject(error);
            });
    })
}

let GrantClaim = (AdharNo, TransactionID, insurerName) => {
    let ClaimDetails = {
        _id: TransactionID,
        TransactionID: TransactionID,
        claimStatus: 'Grant',
        insurer: insurerName
    }
    return new Promise((resolve, reject) => {
        Claim.replaceOne({
            _id: AdharNo
        }, {
            $set: {
                Treatment: ClaimDetails
            }
        }).then(doc => {
            resolve(200);
        }).catch(err => {
            console.log(err);
            reject(500);
        })

    })
}

let declineClaim = (data) => {
    return new Promise((resolve, reject) => {
        Claim
            .updateOne({
                _id: data.AdharNo
            }, {
                $pull: {
                    Treatment: {
                        _id: data.TransactionID
                    }
                }
            })
            .then(res => {
                resolve(200);
            }).catch(500);

    })
}

// acceptClaim(sample).then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log(err);
// })




module.exports = {
    acceptClaim,
    declineClaim
}