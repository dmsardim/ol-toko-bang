const express = require('express')
const router = express.Router()
const TransactionController = require('../controllers/transaction')
const { auth } = require('../middleware')


router.get('/carts', auth, TransactionController.carts)
router.post('/cart/:id/addCart', auth, TransactionController.addCart)

module.exports = router