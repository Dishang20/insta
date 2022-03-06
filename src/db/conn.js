const mongoose = require('mongoose')

module.exports = mongoose.connect('mongodb://localhost:27017/insta').then(() => {
    console.log('Db connected');
}).catch(err => {
    console.log(err);
})