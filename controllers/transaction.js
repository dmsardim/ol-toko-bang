const { Transaction, Item } = require("../models");

class TransactionController {
  static addCart(req, res) {
    const { qty } = req.body
    const { id } = req.params
    const UserId = req.session.user.id

    Item.findByPk(id)
      .then((item) => {
        const subtotal = item.price * qty
        return Transaction.create({ qty, ItemId: item.id, status: 'cart', UserId, subtotal })
      })
      .then((_) => res.redirect('/'))
      .catch((err) => res.send(err))
  }

  static carts(req, res) {
    const UserId = req.session.user.id

    Transaction.findAll({
      attributes:['id', 'qty', 'subtotal'],
      include: Item,
      where: {
        UserId,
        status: 'cart'
      }
    })
      .then((carts) => res.render('items/carts', {carts} ))
      .catch((err) => res.send(err))
  }

  static deleteCart(req, res) {
    const { id } = req.params

    Transaction.destroy({ where: { id } })
      .then((_) => res.redirect('/carts'))
      .catch((err) => res.send(err))
  }
}

module.exports = TransactionController 