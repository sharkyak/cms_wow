const express = require('express')
const router = express.Router()
const {
    addUser,
    getUserInfo,
    addGold,
    payout
} = require('../controllers/transactions')

router
    .route('/')
    .get((req, res) => res.send('node server'))
    .post(getUserInfo)

router.route('/adduser').post(addUser)

router.route('/addgold').post(addGold)

router.route('/pay').post(payout)

module.exports = router
