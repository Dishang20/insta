const mongoose = require('mongoose')

const instaUser = new mongoose.Schema({
    pk: {
        type: Number,
    },
    username: {
        type: String
    }
}, { timestamps: true })

const user = mongoose.model('users', instaUser)

module.exports = user