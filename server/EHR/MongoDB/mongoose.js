require("dotenv").config();
var mongoose = require('mongoose');
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.Promise = global.Promise;
mongoose.connect(`${MONGODB_URL}`, {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log('Unable to connect MongoDB server', err);
    }
});

let saveToDB = (privatekey, adharNo) => {
    return new Promise((resolve, reject) => {
        let newKey = new keyModel({

            privateKey: generatedkey
        });
        newKey.save().then(
            doc => {
                resolve(doc);
            },
            err => {
                console.log(err);
                reject(err);
            }
        );
    })
}

module.exports = {
    mongoose
};