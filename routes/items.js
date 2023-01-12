const express = require('express')
const router = express.Router()

const ControllerItem = require('../controllers/item')

const isSeller = (req, res, next) => {
    // console.log(req.session);
    const {id} = req.session.id;
    if(req.session.role != "seller") {
        const msg = "you're not a seller!"
        res.redirect(`/?validationLogin=${msg}`)
    } else {
        next()
    }
}

router.get('/seller/:UserId', isSeller, ControllerItem.listItemSeller)

router.get('/seller/listBuyer', isSeller, ControllerItem.listBuyer)

router.get('/seller/:UserId/add',isSeller, ControllerItem.formAddItem)
router.post('/seller/:UserId/add',isSeller, ControllerItem.submitAddItem)

router.get('/seller/:UserId/edit/:ItemId', isSeller, ControllerItem.formEditItem)
router.post('/seller/:UserId/edit/:ItemId', isSeller, ControllerItem.submitEditItem)

router.get('/seller/:UserId/delete/:ItemId', isSeller, ControllerItem.deleteItem)
router.get('/seller/:UserId/update/:ItemId', isSeller, ControllerItem.updateItem)

const isBuyer = (req, res, next) => {
    // console.log(req.session);
    const {id} = req.session.id;
    if(req.session.role != "buyer") {
        const msg = "you're not a buyer!"
        res.redirect(`/?validationLogin=${msg}`)
    } else {
        next()
    }
}
router.get('/buyer/:UserId', isBuyer, ControllerItem.listItemForBuyer)
router.get('/buyer/:UserId/buy/:ItemId', isBuyer, ControllerItem.buyItem)

module.exports = router