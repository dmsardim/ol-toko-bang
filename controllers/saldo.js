const {Saldo, User} = require('../models')
const {countAddSaldoBuyer} = require('../helper')

class ControllerSaldo {
    static formAddSaldo (req, res) {
        const {UserId} = req.params;
        Saldo.findOne({where: {UserId: UserId}, include: User})
        .then(saldo => {
            res.render('form-add-saldo', {saldo})
        })
    }

    static submitAddSaldo(req, res) {
        const {UserId} = req.params;
        const {amount} = req.body;
        Saldo.findOne({where: {UserId: UserId}})
        .then((saldo) => {
            countAddSaldoBuyer(+amount, saldo.UserId)
            res.redirect(`/items/buyer/${UserId}`)
        })
        .catch(err => res.send(err))
    }
} 

module.exports = ControllerSaldo