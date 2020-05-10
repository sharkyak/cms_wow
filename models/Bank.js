const mongoose = require('mongoose')

const BankSchema = new mongoose.Schema({
    summ: {
        type: Number,
        required: [true, 'Укажите сумму']
    },
    sellprice: {
        type: Number,
        required: [true, 'Укажите цену продажи']
    },
    user: {
        type: mongoose.ObjectId,
        required: true
    },
    descr: {
        type: String,
        required: [true, 'Укажите персонажа']
    },
    correction: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Bank', BankSchema)
