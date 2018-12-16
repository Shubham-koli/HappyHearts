const {
    mongoose
} = require("../EHR/MongoDB/mongoose");

const {
    Claim
} = require("../EHR/models/claimStatus");



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
                            resolve(tmp);
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

module.exports = {
    filterClaims
}