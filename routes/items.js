const express = require('express')
const router = express.Router()

const ControllerItem = require('../controllers/item')
const { isSeller, isBuyer } = require('../middleware')


router.get('/seller/:UserId', isSeller, ControllerItem.listItemSeller)

router.get('/seller/listBuyer', isSeller, ControllerItem.listBuyer)

router.get('/seller/:UserId/add',isSeller, ControllerItem.formAddItem)
router.post('/seller/:UserId/add',isSeller, ControllerItem.submitAddItem)

router.get('/seller/:UserId/edit/:ItemId', isSeller, ControllerItem.formEditItem)
router.post('/seller/:UserId/edit/:ItemId', isSeller, ControllerItem.submitEditItem)

router.get('/seller/:UserId/delete/:ItemId', isSeller, ControllerItem.deleteItem)
router.get('/seller/:UserId/update/:ItemId', isSeller, ControllerItem.updateItem)

router.get('/buyer/:UserId', isBuyer, ControllerItem.listItemForBuyer)

module.exports = router