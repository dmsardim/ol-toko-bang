const express = require('express')
const router = express.Router()
const Controller = require('../controllers')

const routerUsers = require('./users')
const routerBalance = require('./balances')
const routerItems = require('./items')
const routerTags = require('./tags')
const routerTrans = require('./transaction')

const { auth } = require('../middleware')
const ControllerItem = require('../controllers/item')


router.get('/', Controller.home)
router.use('/users', routerUsers)
router.get('/items/:id', ControllerItem.detailItem)
router.use(auth)
router.use(routerTrans)
router.use('/balances', routerBalance)
router.use('/items', routerItems)
router.use('/tags', routerTags)

module.exports = router