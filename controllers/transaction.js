const { countStock } = require("../helper");
const { Transaction, Item, User, Balance } = require("../models");

class TransactionController {
  
  static addCart(req, res) {
    const { qty } = req.body
    const { id } = req.params
    const UserId = req.session.user.id
    
    Item.findByPk(id)
      .then((item) => {
        if(item.stock < qty){
          throw 'Cannot add item to cart!'
        }
        const subtotal = item.price * qty
        return Transaction.create({ qty, ItemId: item.id, status: 'cart', UserId, subtotal })
      })
      .then((_) => res.redirect('/carts'))
      .catch((err) => res.send(err))
  }

  static carts(req, res) {
    const UserId = req.session.user.id

    Transaction.findAll({
      attributes: ['id', 'qty', 'subtotal'],
      include: Item,
      where: {
        UserId,
        status: 'cart'
      }
    })
      .then((carts) => res.render('items/carts', { carts }))
      .catch((err) => res.send(err))
  }

  static purchased(req, res) {
    const UserId = req.session.user.id

    Transaction.findAll({
      attributes: ['id', 'qty', 'subtotal'],
      include: Item,
      where: {
        UserId,
        status: 'checkout'
      }
    })
      .then((carts) => res.render('items/purchased', { carts }))
      .catch((err) => res.send(err))
  }

  static deleteCart(req, res) {
    const { id } = req.params

    Transaction.destroy({ where: { id } })
      .then((_) => res.redirect('/carts'))
      .catch((err) => res.send(err))
  }

  static checkout(req, res) {
    const { id } = req.params
    let checkout;
    Transaction.findByPk(id, { include: { model: Item, include: { model: User, include: Balance } } })
      .then((cart) => {
        checkout = cart
        return User.findByPk(cart.UserId, { include: Balance })
      })
      .then((user) => {
        if (user.Balance.dataValues.amount <= checkout.subtotal) {
          throw 'Your balance not enough'
        }
        return user.Balance.decrement({ amount: checkout.subtotal })
      })
      .then((_) => {
        return checkout.Item.decrement({ stock: checkout.qty })
      })
      .then((item) => {
        return item.User.Balance.increment({ amount: checkout.subtotal })
      })
      .then((_) => {
        return checkout.update({ status: 'checkout' })
      }).then((_) => res.redirect('/carts'))

      .catch((err) => res.send(err))
  }
}

module.exports = TransactionController 