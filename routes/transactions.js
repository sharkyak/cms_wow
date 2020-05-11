const express = require('express')
const router = express.Router()
const {
    addUser,
    getUserInfo,
    getUsers,
    addGold,
    payout,
    getPayouts,
    getAllGold
} = require('../controllers/transactions')

router.route('/').get(getUsers).post(getUserInfo)

router.route('/adduser').post(addUser)

router.route('/addgold').post(addGold)

router.route('/pay').post(payout)

router.route('/payouts').post(getPayouts)

router.route('/allgold').post(getAllGold)

module.exports = router
