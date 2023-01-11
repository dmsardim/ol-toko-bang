const express = require('express')
const router = express.Router()

const ControllerItem = require('../controllers/item')
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

router.get('/seller/:UserId', ControllerItem.listItemSeller)

router.get('/seller/listBuyer', ControllerItem.listBuyer)

router.get('/seller/:UserId/add', ControllerItem.formAddItem)
router.post('/seller/:UserId/add', ControllerItem.submitAddItem)

router.get('/seller/:UserId/edit/:ItemId', ControllerItem.formEditItem)
router.post('/seller/:UserId/edit/:ItemId', ControllerItem.submitEditItem)

router.get('/seller/:UserId/delete/:ItemId', ControllerItem.deleteItem)
router.get('/seller/:UserId/update/:ItemId', ControllerItem.updateItem)

router.get('/buyer/:UserId', ControllerItem.listItemForBuyer, auth)

router.get('/buyer/:UserId/buy/:ItemId', ControllerItem.buyItem)

module.exports = router