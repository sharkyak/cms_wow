const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    gold: {
        type: Number,
        required: true
    },
    topay: {
        type: Number,
        required: true
    },
    payed: {
        type: Number,
        required: true
    },
    percent: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('User', UserSchema)
