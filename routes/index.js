const express = require('express')
const router = express.Router()

const Controller = require('../controllers')

router.get('/', Controller.home)

const routerUsers = require('./users')
const routerSaldos = require('./saldos')
const routerItems = require('./items')
const routerTags = require('./tags')

router.use('/users', routerUsers)
router.use('/saldos', routerSaldos)
router.use('/items', routerItems)
router.use('/tags', routerTags)

module.exports = router