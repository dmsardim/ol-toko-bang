const express = require('express')
const router = express.Router()

const ControllerUser = require('../controllers/user')

router.get('/register', ControllerUser.formRegisterUser)
router.post('/register', ControllerUser.submitRegisterUser)

router.get('/login', ControllerUser.formLoginUser)
router.post('/login', ControllerUser.submitLoginUser)

router.get('/logout', ControllerUser.logout)



// router.use((req, res, next) => {
//     if (!req.session.email){
//         const validate = "login first"
//         res.redirect(`/users/login?validation=${validate}`)
//     } else {
//         next()
//     }
// })


module.exports = router