const mongoose = require('mongoose')

const PayoutSchema = new mongoose.Schema({
    summ: {
        type: Number,
        required: [true, 'Укажите сумму']
    },
    user: {
        type: mongoose.ObjectId,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    descr: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Payout', PayoutSchema)
