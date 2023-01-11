const express = require('express')
const router = express.Router()
const Controller = require('../controllers')

const routerUsers = require('./users')
const routerSaldos = require('./saldos')
const routerItems = require('./items')
const routerTags = require('./tags')

const { auth } = require('../middleware')

router.get('/', Controller.home)
router.use('/users', routerUsers)

router.use(auth)

router.use('/saldos', routerSaldos)
router.use('/items', routerItems)
router.use('/tags', routerTags)

module.exports = router