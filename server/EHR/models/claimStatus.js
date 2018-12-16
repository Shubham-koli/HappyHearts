const {
    mongoose
} = require("../MongoDB/mongoose");



let Claim = mongoose.model("Claim", {
    _id: {
        type: String,
        required: true,
        trim: 1
    },
    Treatment: [{
        TransactionID: String,
        claimStatus: String
    }]
});

let Claims = AdharNo => {
    return new Promise((resolve, reject) => {
        let newClaim = new Claim({
            _id: AdharNo
        });

        newClaim.save().then(doc => {
            resolve(200);
        }).catch(err => {
            reject(500);
        })
    })
}

let ClaimDetails = {
    TransactionID: '0a7c9ac08720878fed17acf7b611945cabb60ccb077496b73bd09226885be51a',
    claimStatus: 'OPEN'
}

// Claims('8421999884').then(doc => {
//     Claim.update({
//         _id: '8421999884'
//     }, {
//         $push: {
//             Treatment: ClaimDetails
//         }
//     });
// });


// Claim.findOneAndUpdate({
//         _id: '8421999884'
//     }, {
//         $push: {
//             Treatment: ClaimDetails
//         }
//     },
//     function (error, success) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(success);
//         }
//     });

module.exports = {
    Claim
};