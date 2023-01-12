const express = require('express')
const router = express.Router()

const ControllerBalance = require('../controllers/balance')

router.get('/addBalance/:UserId', ControllerBalance.formAddBalance)
router.post('/addBalance/:UserId', ControllerBalance.submitAddBalance)

module.exports = router