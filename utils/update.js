const Bank = require('../models/Bank')
const User = require('../models/User')
const Payout = require('../models/Payout')

exports.updateGold = async () => {
    const tx = await Bank.find()

    let deposits = []
    tx.forEach(el => {
        if (el.summ > 0) deposits.push(el)
    })

    let users = {}

    deposits.forEach(dep => {
        const id = dep.user.toString()
        users[id] = (users[id] || 0) + dep.summ
    })

    for (user in users) {
        await User.updateOne({ _id: user }, { gold: users[user] })
    }
}

exports.updateTopay = async () => {
    await User.updateMany({}, { payed: 0 })

    const payouts = await Payout.find()

    for (const payout of payouts) {
        await User.updateOne(
            { _id: payout.user },
            { $inc: { payed: payout.summ, topay: -payout.summ } }
        )
    }
}

exports.updateSells = async () => {
    const tx = await Bank.find()

    let deposits = []
    let sales = []
    tx.forEach(el => {
        if (el.summ > 0) deposits.push(el)
        else if (el.summ < 0) sales.push(el)
    })

    let users = {}

    let blockEnd = 0
    sales.forEach(sale => {
        blockEnd += Math.abs(sale.summ)
        const blockStart = blockEnd - Math.abs(sale.summ)
        // console.log(`${blockStart}, ${blockEnd}`.red)

        let depBlockEnd = 0
        deposits.forEach(dep => {
            const id = dep.user.toString()
            depBlockEnd += dep.summ
            const depBlockStart = depBlockEnd - dep.summ
            // console.log(`     ${depBlockStart}, ${depBlockEnd}`.green)

            if (depBlockStart >= blockStart && depBlockEnd <= blockEnd) {
                const summ = position1(
                    depBlockStart,
                    depBlockEnd,
                    blockStart,
                    blockEnd,
                    sale.sellprice
                )
                users[id] = (users[id] || 0) + summ
                // console.log(`        Position 1, ${summ}`.yellow.bold)
            } else if (depBlockStart <= blockStart && depBlockEnd >= blockEnd) {
                const summ = position2(
                    depBlockStart,
                    depBlockEnd,
                    blockStart,
                    blockEnd,
                    sale.sellprice
                )
                users[id] = (users[id] || 0) + summ
                // console.log(`        Position 2, ${summ}`.yellow.bold)
            } else if (
                depBlockStart <= blockStart &&
                depBlockEnd <= blockEnd &&
                depBlockEnd > blockStart
            ) {
                const summ = position3(
                    depBlockStart,
                    depBlockEnd,
                    blockStart,
                    blockEnd,
                    sale.sellprice
                )
                users[id] = (users[id] || 0) + summ
                // console.log(`        Position 3, ${summ}`.yellow.bold)
            } else if (
                depBlockStart >= blockStart &&
                depBlockEnd >= blockEnd &&
                depBlockStart < blockEnd
            ) {
                const summ = position4(
                    depBlockStart,
                    depBlockEnd,
                    blockStart,
                    blockEnd,
                    sale.sellprice
                )
                users[id] = (users[id] || 0) + summ
                // console.log(`        Position 4, ${summ}`.yellow.bold)
            }
        })
    })

    // console.log(users)
    for (user in users) {
        const usr = await User.findOne({ _id: user })

        await User.updateOne(
            { _id: user },
            { topay: round(users[user] * (1 - usr.percent / 100)) }
        )
    }
}

const position1 = (
    depBlockStart,
    depBlockEnd,
    blockStart,
    blockEnd,
    sellprice
) => {
    return round(((depBlockEnd - depBlockStart) * sellprice) / 1000)
}

const position2 = (
    depBlockStart,
    depBlockEnd,
    blockStart,
    blockEnd,
    sellprice
) => {
    return round(((blockEnd - blockStart) * sellprice) / 1000)
}

const position3 = (
    depBlockStart,
    depBlockEnd,
    blockStart,
    blockEnd,
    sellprice
) => {
    return round(((depBlockEnd - blockStart) * sellprice) / 1000)
}

const position4 = (
    depBlockStart,
    depBlockEnd,
    blockStart,
    blockEnd,
    sellprice
) => {
    return round(((blockEnd - depBlockStart) * sellprice) / 1000)
}

const round = num => Math.round(num * 100) / 100
