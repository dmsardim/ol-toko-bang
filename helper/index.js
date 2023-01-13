const {Balance, Item} = require('../models')


// const countBalanceBuyer = (priceItem, BuyerId) => {
//     return Balance.decrement({amount:  priceItem}, {where: {id: BuyerId}})
// }

const countBalanceBuyer = (user, subtotal) => {
    return user.Balance.decrement({amount:  subtotal})
}

// const countStock = (SellerId, stockPurchasedItem, itemId) => {
//     if(stockPurchasedItem>0) {
//         return Item.decrement({stock: 1}, {where: {UserId: SellerId, id: itemId}})
//     }
// }
const countStock = (checkout, qty) => {
    return checkout.Item.decrement({stock: qty})
}

// const countBalanceSeller = (priceItem, SellerId) => {
//     return Balance.increment({amount:  priceItem}, {where: {id: SellerId}})
// }

const countAddBalanceBuyer = (topUp, BuyerId) => {
    return Balance.increment( {amount : topUp}, {where: {UserId: BuyerId}})
}

const totalPrice = (arr) => {
    return arr.map(p => p.qty * p.subtotal).reduce((a,b) => a + b)
}

module.exports = {countBalanceBuyer, countStock, totalPrice, countAddBalanceBuyer}