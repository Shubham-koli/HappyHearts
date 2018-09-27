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


module.exports = {
    mongoose
};