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

router.use('/saldos', auth, routerSaldos)
router.use('/items', auth, routerItems)
router.use('/tags', auth, routerTags)

module.exports = router