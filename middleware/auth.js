const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    const token = req.header('x-auth-token')

    if (!token)
        return res.status(401).json({
            success: false,
            error: 'No token, authorizaton denied'
        })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.body.user = decoded.user
        next()
    } catch (err) {
        res.status(400).json({
            success: false,
            error: 'Token is not valid'
        })
    }
}

module.exports = auth
