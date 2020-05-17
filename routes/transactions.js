const express = require('express')
const router = express.Router()
const {
    addUser,
    getUserInfo,
    getUsers,
    addGold,
    payout,
    getPayouts,
    getAllGold,
    authUser
} = require('../controllers/transactions')
const auth = require('../middleware/auth')

router.route('/auth').post(authUser)

router.route('/').get(auth, getUsers).post(auth, getUserInfo)

router.route('/adduser').post(addUser)

router.route('/addgold').post(auth, addGold)

router.route('/pay').post(auth, payout)

router.route('/payouts').post(auth, getPayouts)

router.route('/allgold').post(auth, getAllGold)

module.exports = router
