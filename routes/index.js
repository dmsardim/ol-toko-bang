const express = require('express')
const router = express.Router()

const Controller = require('../controllers')

router.get('/', Controller.home)

const routerUsers = require('./users')
const routerBalance = require('./balances')
const routerItems = require('./items')
const routerTags = require('./tags')

router.use('/users', routerUsers)
router.use((req, res, next) => {
    console.log(req.session)
    if(!req.session.id) {
        const msg = "login first!"
        res.redirect(`/users/login?validationLogin=${msg}`)
    } else {
        next()
    }
})
router.use('/balances', routerBalance)
router.use('/items', routerItems)
router.use('/tags', routerTags)

module.exports = router