const User = require('../models/User')
const Bank = require('../models/Bank')
const Payout = require('../models/Payout')
const { updateGold, updateSells, updateTopay } = require('../utils/update')

const { v4: uuidv4 } = require('uuid')

// @desc    Add user
// @route   POST /api/v1/adduser
// @access  Public
exports.addUser = async (req, res, next) => {
    try {
        const { name, admin, percent } = req.body

        const user = await User.create({
            uuid: uuidv4(),
            name,
            admin,
            gold: 0,
            topay: 0,
            payed: 0,
            percent
        })

        return res.status(200).json({
            success: true,
            data: user
        })
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message)

            return res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            })
        }
    }
}

// @desc    Get user info
// @route   POST /api/v1/
// @access  Public
exports.getUserInfo = async (req, res, next) => {
    try {
        const { uuid } = req.body

        const user = await User.findOne({
            uuid
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No users found'
            })
        }

        const tx = await Bank.find({ user })

        await updateGold()
        await updateSells()
        await updateTopay()

        return res.status(200).json({
            success: true,
            data: { user, tx }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

// @desc    Add gold to bank
// @route   POST /api/v1/addgold
// @access  Public
exports.addGold = async (req, res, next) => {
    try {
        const { user, summ, descr, correction, sellprice } = req.body

        const tx = await Bank.create({
            user,
            summ,
            descr,
            correction,
            sellprice,
            date: new Date()
        })

        if (summ > 0) await updateGold()
        if (summ < 0) {
            await updateSells()
            await updateTopay()
        }

        return res.status(200).json({
            success: true,
            data: tx
        })
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message)

            return res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            })
        }
    }
}

// @desc    Add payout
// @route   POST /api/v1/pay
// @access  Public
exports.payout = async (req, res, next) => {
    try {
        const { user, summ, descr } = req.body

        const payment = await Payout.create({
            user,
            summ,
            descr,
            date: new Date()
        })

        await User.updateOne(
            { _id: user },
            { $inc: { payed: summ, topay: -summ } }
        )

        return res.status(200).json({
            success: true,
            data: payment
        })
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message)

            return res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            })
        }
    }
}
