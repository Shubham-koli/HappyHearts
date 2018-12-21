const {
    mongoose
} = require("../EHR/MongoDB/mongoose");
const {
    Treatment
} = require("../EHR/models/AnalyticalData");

const {
    getFees
} = require("../routes/TreatmentFees");

let getAvg = (disease) => {
    return new Promise((resolve, reject) => {
        Treatment.find({
                Disease: disease
            }, {
                HospitalFees: 1,
                ConsultancyFees: 1,
                PharmacyFees: 1,
                AcFees: 1
            })
            .then(doc => {
                console.log(doc.length);
                let avg = {};
                let avgHospitalFees = 0;
                let avgConsultancyFees = 0;
                let avgPharmacyFees = 0;
                let avgAcFees = 0;
                doc.forEach(record => {
                    avgHospitalFees += parseFloat(record.HospitalFees) / doc.length;
                    avgConsultancyFees += parseFloat(record.ConsultancyFees) / doc.length;
                    avgPharmacyFees += parseFloat(record.PharmacyFees) / doc.length;
                    avgAcFees += parseFloat(record.AcFees) / doc.length;
                    avg.HospitalFees = avgHospitalFees;
                    avg.ConsultancyFees = avgConsultancyFees;
                    avg.PharmacyFees = avgPharmacyFees;
                    avg.AcFees = avgAcFees;
                });
                //console.log(avg);
                resolve(avg);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    })
}

let detectFraud = async (disease, trasactioId) => {
    let avg = await getAvg(disease);
    let Fees = await getFees('8421999884', trasactioId);
    let result = {};
    // console.log({
    //     avg,
    //     Fees
    // });
    return new Promise((resolve, reject) => {
        if (Fees.Hospital_Fees > avg.HospitalFees || Fees.Consultancy_Fees > avg.ConsultancyFees || Fees.Pharmacy_Fees > avg.Pharmacy_Fees || Fees.Ac_Fees > avg.AcFees) {
            result.fraud = true;
            result.fields = [];
            if ((Fees.Hospital_Fees > avg.HospitalFees)) {
                result.fields.push({
                    fieldName: 'Hospital_Fees',
                    fees: Fees.Hospital_Fees,
                    avg: avg.HospitalFees
                });
            }
            if ((Fees.Consultancy_Fees > avg.ConsultancyFees)) {
                result.fields.push({
                    fieldName: 'Consultancy_Fees',
                    fees: Fees.Consultancy_Fees,
                    avg: avg.ConsultancyFees
                });
            }
            if ((Fees.Pharmacy_Fees > avg.PharmacyFees)) {
                result.fields.push({
                    fieldName: 'Pharmacy_Fees',
                    fees: Fees.Pharmacy_Fees,
                    avg: avg.PharmacyFees
                });
            }
            if ((Fees.Ac_Fees > avg.AcFees)) {
                result.fields.push({
                    fieldName: 'Ac_Fees',
                    fees: Fees.Ac_Fees,
                    avg: avg.AcFees
                });
            }
            // console.log(result);
            resolve(result);
        } else {
            result.fraud = false;
            // console.log(result);
            reject(result);
        }
    });
}

// detectFraud('Maleria', '1381bf2d3b4aa9778b30b918f2e8204e89c034a87b62bc14a863b4d38846bab9').then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log(err);
// })

module.exports = {
    detectFraud
}