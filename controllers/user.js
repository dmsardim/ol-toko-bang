const { User, Item, Balance } = require('../models')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')

class ControllerUser {
    static formRegisterUser(req, res) {
        const { error } = req.query
        res.render('register', { error })
    }

    static submitRegisterUser(req, res) {
        const { name, email, password, noHandphone, role } = req.body;
        const input = { name, email, password, noHandphone, role }
        User.create(input)
            .then((user) => {
                let UserId = user.dataValues.id
                return Balance.create({ UserId })
            })
            .then((balance) => {
                res.redirect('/users/login')
            })
            .catch((err) => {
                if (err.name === "SequelizeValidationError") {
                    let errMsg = err.errors.map((el) => el.message)
                    res.redirect(`/users/register?error=${errMsg}`)
                } else {
                    res.send(err)
                }
            })
    }

    static formLoginUser(req, res) {
        const { validation, validation2, validation3, validationLogin } = req.query;
        res.render('login', { validation, validation2, validation3, validationLogin })
    }

    static logout(req, res) {
        req.session.destroy(() => {
            res.clearCookie('connect.sid')
            res.redirect('/users/login')
        })
    }

    static submitLoginUser(req, res) {
        let { email, password } = req.body
        User.findOne({ where: { email: email } })
            .then((user) => {
                if (user) {
                    if (user.email) {
                        let isValidPassword = bcrypt.compareSync(password, user.password)
                        if (isValidPassword) {
                            req.session.user = { id: user.id, role: user.role };
                            if (user.role === 'seller') {
                                return res.redirect(`/items/seller/${user.id}`)
                            } else {
                                return res.redirect(`/`)
                            }
                        } else {
                            const validate = "Remember your password!"
                            res.redirect(`/users/login?validation=${validate}`)
                        }
                    }

                } else if (!user) {
                    let error = {
                        // name: "noInput",
                        message: []
                    }
                    if (email.length == 0) {
                        error.message.push('Email is required!')
                    }
                    if (password.length == 0) {
                        error.message.push('Password is required!')
                    }
                    if (error.message.length == 0) {
                        return null;
                    } else {
                        res.redirect(`/users/login?validation3=${error.message}`)
                    }
                }
            })
            .catch(err => res.send(err))
    }
}

module.exports = ControllerUser