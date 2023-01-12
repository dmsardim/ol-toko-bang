const express = require('express')
const router = express.Router()
const Controller = require('../controllers')

const routerUsers = require('./users')
const routerBalance = require('./balances')
const routerItems = require('./items')
const routerTags = require('./tags')
const routerTrans = require('./transaction')

const { auth } = require('../middleware')


router.get('/', Controller.home)
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
router.use('/tags', auth, routerTags)

module.exports = router