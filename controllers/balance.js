const {Balance, User} = require('../models')
const {countAddBalanceBuyer} = require('../helper')

class ControllerBalance {
    static formAddBalance (req, res) {
        const {UserId} = req.params;
        Balance.findOne({where: {UserId: UserId}, include: User})
        .then(balance => {
            res.render('form-add-balance', {balance})
        })
    }

    static submitAddBalance(req, res) {
        const {UserId} = req.params;
        const {amount} = req.body;
        Balance.findOne({where: {UserId: UserId}})
        .then((balance) => {
            countAddBalanceBuyer(+amount, balance.UserId)
            res.redirect('/')
        })
        .catch(err => console.log(err))
    }
} 

module.exports = ControllerBalance