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
        claimStatus: String,
        insurer: String
    }]
});

let initClaim = AdharNo => {
    return new Promise((resolve, reject) => {
        let newClaim = new Claim({
            _id: AdharNo
        });

        newClaim.save().then(doc => {
            Claim.findOneAndUpdate({
                    _id: AdharNo
                }, {
                    $push: {
                        Treatment: ClaimDetails
                    }
                },
                function (error, success) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(success);
                    }
                });
            resolve(200);
        }).catch(err => {
            reject(500);
        })
    })
}

let ClaimDetails = {
    TransactionID: 'test',
    claimStatus: 'OPEN',
    insurer: 'test'
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

// initClaim('123').then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log(err);
// })

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
    Claim,
    initClaim
};