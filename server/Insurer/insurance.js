const {
    mongoose
} = require("../EHR/MongoDB/mongoose");

const {
    Claim
} = require("../EHR/models/claimStatus");

const {
    getPolicy
} = require("./policies");

const {
    getFees
} = require("../routes/TreatmentFees");

const _ = require("lodash");


let data = [{
        "HospitalName": "Apollo Hospital",
        "StaffId": "DOC3893",
        "ChronicDisease": "NA",
        "Disease": "Fever",
        "DiseaseType": "NA",
        "DiseaseCategory": "NA",
        "DiseaseSubCategory": "NA",
        "symptom": "Increased body tempurature",
        "allergies": "NA",
        "Flag": "false",
        "AlcoholConsumption": "Yes",
        "SmokingHabits": "Yes",
        "medicines": "Fes 20mg",
        "tests": "NA",
        "HospitalFees": "100",
        "ConsultancyFees": "100",
        "PharmacyFees": "100",
        "AcFees": "0",
        "patientData": "resource:org.example.basic.PatientData#8421999884",
        "transactionId": "1381bf2d3b4aa9778b30b918f2e8204e89c034a87b62bc14a863b4d38846bab9",
        "Address": "Sangli",
        "HospitalId": "HS12345",
        "Date": "2018-12-17 14:42:12",
        "StaffName": "DR. Shubham Koli"
    },
    {
        "HospitalName": "Apollo Hospital",
        "StaffId": "DOC3893",
        "ChronicDisease": "NA",
        "Disease": "Maleria",
        "DiseaseType": "M1",
        "DiseaseCategory": "NA",
        "DiseaseSubCategory": "NA",
        "symptom": "Fever",
        "allergies": "NA",
        "Flag": "true",
        "AlcoholConsumption": "No",
        "SmokingHabits": "No",
        "medicines": "Decold Total 20mg",
        "tests": "Bloodtest",
        "HospitalFees": "100",
        "ConsultancyFees": "200",
        "PharmacyFees": "200",
        "AcFees": "0",
        "patientData": "resource:org.example.basic.PatientData#8421999884",
        "transactionId": "977a5bf50b15a709020ca66e679acced498a87903e6084f7b092cdf7d855b828",
        "Address": "Sangli",
        "HospitalId": "HS12345",
        "Date": "2018-12-17 14:40:36",
        "StaffName": "DR. Shubham Koli"
    },
    {
        "HospitalName": "Apollo Hospital",
        "StaffId": "DOC3893",
        "ChronicDisease": "NA",
        "Disease": "Stroke",
        "DiseaseType": "Cerebrovascular Disease",
        "DiseaseCategory": "NA",
        "DiseaseSubCategory": "NA",
        "symptom": "Face drooping, Arm weakness, Speech difficulty",
        "allergies": "NA",
        "Flag": "true",
        "AlcoholConsumption": "Yes",
        "SmokingHabits": "Yes",
        "medicines": "Antihypertensives",
        "tests": "CT scan",
        "HospitalFees": "200",
        "ConsultancyFees": "500",
        "PharmacyFees": "400",
        "AcFees": "0",
        "patientData": "resource:org.example.basic.PatientData#8421999884",
        "transactionId": "c3aaba6ed45843f377cf17e856c85d4c219784580c1c7199570b75d6b41757ca",
        "Address": "Sangli",
        "HospitalId": "HS12345",
        "Date": "2018-12-21 13:42:53",
        "StaffName": "DR. Shubham Koli"
    }
]


let getClaims = AdharNo => {
    return new Promise((resolve, reject) => {
        Claim.findById({
            _id: AdharNo
        }).then(doc => {
            resolve(doc);
        })
    })
}

let addClaim = (AdharNo, TransactionID, insurerName) => {
    let ClaimDetails = {
        _id: TransactionID,
        TransactionID: TransactionID,
        claimStatus: 'UNDER PROCESS',
        insurer: insurerName
    }
    return new Promise((resolve, reject) => {
        Claim.findOneAndUpdate({
            _id: AdharNo
        }, {
            $push: {
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

// addClaim('8421999884', '0a7c9ac08720878fed17acf7b611945cabb60ccb077496b73bd09226885be51d', 'Bajaj').then(doc => {
//     console.log(doc)
// })


// getClaims('8421999884').then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log(err);
// })

// let filterClaims = (data, AdharNo) => {
//     try {
//         let tmp = [];
//         return new Promise((resolve, reject) => {
//             try {
//                 getClaims(AdharNo).then(doc => {
//                     doc.Treatment.forEach(element => {
//                         for (let i = 0; i < data.length; i++) {
//                             if ((element.TransactionID == data[i].transactionId) && (element.claimStatus == 'UNDER PROCESS')) {
//                                 data[i].claimStatus = 'UNDER PROCESS';
//                                 tmp.push(data[i]);

//                             } else {
//                                 data[i].claimStatus = 'OPEN';
//                                 tmp.push(data[i]);
//                             }
//                         }
//                         if (data.length == tmp.length) {
//                             let non_duplidated_data = _.uniq(tmp, 'transactionId');
//                             resolve(non_duplidated_data);
//                         }

//                     });
//                 })
//             } catch (error) {
//                 console.log(error);
//                 reject(500);
//             }
//         })

//     } catch (error) {
//         console.log(error);

//     }
// }
let filterClaims = (data, AdharNo) => {
    return new Promise((resolve, reject) => {
        try {
            let tmp = [];
            data.forEach(ids => {
                // console.log(ids.transactionId);
                Claim.find({
                    _id: AdharNo
                }, {
                    Treatment: {
                        $elemMatch: {
                            _id: ids.transactionId
                        }
                    }
                }).then(doc => {
                    // console.log(doc.Treatment);
                    if (doc[0].Treatment.length > 0) {
                        // console.log("Element Found", JSON.stringify(doc));
                        ids.claimStatus = doc[0].Treatment[0].claimStatus;
                        tmp.push(ids);
                        // console.log(data.length, tmp.length);
                        if (tmp.length == data.length) {
                            resolve(tmp);
                        }
                    } else {
                        // console.log("Element Not Found", doc);
                        ids.claimStatus = 'OPEN';
                        tmp.push(ids);
                        if (tmp.length == data.length) {
                            resolve(tmp);
                        }
                    }
                })

            });

        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}


// filterClaims(data, '8421999884').then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log(err);
// })

let viewDetails = async (AdharNo, transactionId, insurer) => {

    try {
        let policyDetails = await getPolicy(AdharNo, insurer);
        let treatmentFees = await getFees(AdharNo, transactionId);
        let details = treatmentFees;
        // console.log(treatmentFees);
        details.You_Can_Claim_Hospital_Fees_Upto = policyDetails.HospitalFees;
        details.You_Can_Claim_Consultancy_Fees_Upto = policyDetails.ConsultancyFees;
        details.You_Can_Claim_Pharmacy_Fees_Upto = policyDetails.PharmacyFees;
        details.You_Can_Claim_AC_Fees_Upto = policyDetails.AcFees;
        details.Your_Insurers_Name = policyDetails.InsurerName;
        details.Your_Adhar_No = policyDetails.CustomerAdharNo
        details.Expiry_Date_Of_Insurance = policyDetails.expiry;
        details.status = "200";
        delete policyDetails;
        delete treatmentFees;
        return new Promise((resolve, reject) => {
            resolve(details);
        }).catch(err => {
            reject(500);
        });
    } catch (error) {
        console.log('error in viewDetails async function');
    }

}

// viewDetails('8421999884', '977a5bf50b15a709020ca66e679acced498a87903e6084f7b092cdf7d855b828', 'Bajaj').then(doc => {
//     console.log(doc);
// })

module.exports = {
    filterClaims,
    addClaim,
    viewDetails
}