const express = require('express')
const router = express.Router()

const ControllerItem = require('../controllers/item')
const TransactionController = require('../controllers/transaction')
const { auth } = require('../middleware')

// const isSeller = (req, res, next) => {
//     // console.log(req.session);
//     const {id} = req.session.id;
//     if(req.session.role != "seller") {
//         const msg = "login first!"
//         res.redirect(`/users/login?validationLogin=${msg}`)
//     } else {
//         next()
//     }
// }

router.get('/seller/listBuyer', auth, ControllerItem.listBuyer)

router.get('/seller/:UserId', auth, ControllerItem.listItemSeller)

router.get('/seller/:UserId/add', auth, ControllerItem.formAddItem)
router.post('/seller/:UserId/add', auth, ControllerItem.submitAddItem)

router.get('/seller/:UserId/edit/:ItemId', auth, ControllerItem.formEditItem)
router.post('/seller/:UserId/edit/:ItemId', auth, ControllerItem.submitEditItem)

router.get('/seller/:UserId/delete/:ItemId', auth, ControllerItem.deleteItem)
router.get('/seller/:UserId/update/:ItemId', auth, ControllerItem.updateItem)


router.get('/buyer/:UserId', auth, ControllerItem.listItemForBuyer, auth)

router.get('/buyer/:UserId/buy/:ItemId', auth, ControllerItem.buyItem)

router.get('/:id', ControllerItem.detailItem)

module.exports = router