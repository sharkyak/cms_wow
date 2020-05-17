const User = require('../models/User')
const Bank = require('../models/Bank')
const Payout = require('../models/Payout')
const { updateGold, updateSells, updateTopay } = require('../utils/update')
const jwt = require('jsonwebtoken')

const { v4: uuidv4 } = require('uuid')

// @desc    Auth
// @route   POST /api/v1/auth
// @access  Public
exports.authUser = async (req, res, next) => {
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

        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
            expiresIn: 86400
        })
        if (!token) throw Error('Couldnt sign the token')

        return res.status(200).json({
            success: true,
            data: { token, user }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

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
// @access  Private
exports.getUserInfo = async (req, res, next) => {
    try {
        const userId = req.body.user

        const user = await User.findOne({
            _id: userId
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No users found'
            })
        }

        const tx = await Bank.find({ user }).sort({ _id: -1 }).limit(10)

        // await updateGold()
        // await updateSells()
        // await updateTopay()

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

// @desc    Get all gold data
// @route   POST /api/v1/allgold
// @access  Private
exports.getAllGold = async (req, res, next) => {
    try {
        const alltx = await Bank.find()

        const balance = alltx.reduce((acc, curr) => acc + curr.summ, 0)

        const tx = await Bank.find().sort({ _id: -1 }).limit(20)

        return res.status(200).json({
            success: true,
            data: { balance, tx }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

// @desc    Get all payouts
// @route   POST /api/v1/payouts
// @access  Private
exports.getPayouts = async (req, res, next) => {
    try {
        const tx = await Payout.find().sort({ _id: -1 }).limit(10)

        return res.status(200).json({
            success: true,
            data: { tx }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

// @desc    Get all users
// @route   GET /api/v1/
// @access  Private
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find()

        const data = users.map(el => {
            return { _id: el._id, name: el.name, topay: el.topay }
        })

        return res.status(200).json({
            success: true,
            data
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
// @access  Private
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
// @access  Private
exports.payout = async (req, res, next) => {
    try {
        const { usertopay, summ, descr } = req.body

        const payment = await Payout.create({
            user: usertopay,
            summ,
            descr,
            date: new Date()
        })

        await User.updateOne(
            { _id: usertopay },
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
