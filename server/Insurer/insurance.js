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
        "StaffId": "DOC12345",
        "ChronicDisease": "Asthama",
        "Disease": "Malaria",
        "DiseaseType": "Infectious",
        "DiseaseCategory": "Vector Borne",
        "DiseaseSubCategory": "Plasmodium",
        "symptom": "Night Sheevering",
        "allergies": "NA",
        "Flag": "true",
        "weight": "87",
        "AlcoholConsumption": "NA",
        "SmokingHabits": "NA",
        "medicines": "Malarium",
        "tests": "Blood Test",
        "HospitalFees": "5000",
        "ConsultancyFees": "1000",
        "PharmacyFees": "1500",
        "AcFees": "700",
        "claimStatus": "ACTIVE",
        "patientData": "resource:org.example.basic.PatientData#8421999884",
        "transactionId": "ffb28b78354cd1168b2c383c179c231ebb726ec618ac0cdf121c669cf82a8bf4",
        "Address": "413001",
        "HospitalId": "HS12345",
        "Date": "2018-12-16 14:48:50",
        "StaffName": "DR. Shubham Koli"
    },
    {
        "HospitalName": "Apollo Hospital",
        "StaffId": "DOC12345",
        "ChronicDisease": "Asthama",
        "Disease": "Malaria",
        "DiseaseType": "Infectious",
        "DiseaseCategory": "Vector Borne",
        "DiseaseSubCategory": "Plasmodium",
        "symptom": "Night Sheevering",
        "allergies": "NA",
        "Flag": "true",
        "weight": "87",
        "AlcoholConsumption": "NA",
        "SmokingHabits": "NA",
        "medicines": "Malarium",
        "tests": "Blood Test",
        "HospitalFees": "5000",
        "ConsultancyFees": "1000",
        "PharmacyFees": "1500",
        "AcFees": "700",
        "claimStatus": "OPEN",
        "patientData": "resource:org.example.basic.PatientData#8421999884",
        "transactionId": "0a7c9ac08720878fed17acf7b611945cabb60ccb077496b73bd09226885be51d",
        "Address": "413001",
        "HospitalId": "HS12345",
        "Date": "2018-12-16 15:36:29",
        "StaffName": "DR. Shubham Koli"
    },
    {
        "HospitalName": "Apollo Hospital",
        "StaffId": "DOC12345",
        "ChronicDisease": "Asthama",
        "Disease": "Malaria",
        "DiseaseType": "Infectious",
        "DiseaseCategory": "Vector Borne",
        "DiseaseSubCategory": "Plasmodium",
        "symptom": "Night Sheevering",
        "allergies": "NA",
        "Flag": "true",
        "weight": "87",
        "AlcoholConsumption": "NA",
        "SmokingHabits": "NA",
        "medicines": "Malarium",
        "tests": "Blood Test",
        "HospitalFees": "5000",
        "ConsultancyFees": "1000",
        "PharmacyFees": "1500",
        "AcFees": "700",
        "patientData": "resource:org.example.basic.PatientData#8421999884",
        "transactionId": "0b0fb8ead1f643d1e10731245ee7fae234bb1e7bb3bb6008d93518d7c473cb22",
        "Address": "413001",
        "HospitalId": "HS12345",
        "Date": "2018-12-16 15:36:05",
        "StaffName": "DR. Shubham Koli"
    }
];




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

let filterClaims = (data, AdharNo) => {
    try {
        let tmp = [];
        return new Promise((resolve, reject) => {
            try {
                getClaims(AdharNo).then(doc => {
                    doc.Treatment.forEach(element => {

                        for (let i = 0; i < data.length; i++) {
                            if ((element.TransactionID == data[i].transactionId) && (element.claimStatus == 'UNDER PROCESS')) {
                                data[i].claimStatus = 'UNDER PROCESS';
                                tmp.push(data[i]);

                            } else {
                                data[i].claimStatus = 'OPEN';
                                tmp.push(data[i]);
                            }
                        }
                        if (data.length == tmp.length) {
                            let non_duplidated_data = _.uniq(tmp, 'transactionId');
                            resolve(non_duplidated_data);
                        }

                    });
                })
            } catch (error) {
                console.log(error);
                reject(500);
            }
        })

    } catch (error) {
        console.log(error);

    }
}

// filterClaims(data, '8421999884').then(doc => {
//     console.log(doc);
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