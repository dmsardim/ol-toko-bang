const express = require('express')
const router = express.Router()

const ControllerSaldo = require('../controllers/saldo')

router.get('/addSaldo/:UserId', ControllerSaldo.formAddSaldo)
router.post('/addSaldo/:UserId', ControllerSaldo.submitAddSaldo)

module.exports = router