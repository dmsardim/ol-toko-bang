const { countBalanceBuyer, totalPrice } = require("../helper");
const { Transaction, Item, User, Balance } = require("../models");
const sendMail = require("../helper/nodemailer");
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
    const {errorCheckout} = req.query;

    Transaction.findAll({
      attributes: ['id', 'qty', 'subtotal'],
      include: Item,
      where: {
        UserId,
        status: 'cart'
      }
    })
      .then((carts) => res.render('items/carts', { carts, errorCheckout }))
      .catch((err) => console.log(err))
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
      .then((carts) => {
        let total = totalPrice(carts)
        res.render('items/purchased', { carts, total })
      })
      .catch((err) => console.log(err))
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
    let seller = {}
    Transaction.findByPk(id, { include: { model: Item, include: { model: User, include: Balance } } })
      .then((cart) => {
        checkout = cart
        return User.findByPk(cart.UserId, { include: Balance })
      })
      .then((user) => {
        if (user.Balance.dataValues.amount <= checkout.subtotal) {
          // let errMsg = `Your balance is not enough, Pak ${user.name}!`
          // res.redirect(`/carts?errorCheckout=${errMsg}`)
          throw 'Your balance is not enough!'
        }
        return countBalanceBuyer(user, checkout.subtotal)
      })
      .then((_) => {
        // res.send(checkout);
        return checkout.Item.decrement({ stock: checkout.qty })
      })
      .then((item) => {
        seller = item.User
        return item.User.Balance.increment({ amount: checkout.subtotal })
      })
      .then((_) => {
        sendMail(seller)
        return checkout.update({ status: 'checkout' })
      }).then((_) => res.redirect('/carts'))

      .catch((err) => res.send(err))
  }
}

module.exports = TransactionController 