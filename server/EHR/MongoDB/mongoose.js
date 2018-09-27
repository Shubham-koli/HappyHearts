require("dotenv").config();
var mongoose = require('mongoose');
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost:27017/UserKeys`, {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log('Unable to connect MongoDB server', err);
    }
});


module.exports = {
    mongoose
};