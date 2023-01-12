const express = require('express')
const router = express.Router()
const TransactionController = require('../controllers/transaction')


router.get('/carts', TransactionController.carts)
router.get('/cart/:id/delete', TransactionController.deleteCart)
router.post('/cart/:id/addCart', TransactionController.addCart)
router.get('/carts/:id/checkout', TransactionController.checkout)

module.exports = router