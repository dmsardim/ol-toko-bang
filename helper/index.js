const {Item, Saldo} = require('../models')

const countStock = (SellerId, stockPurchasedItem, itemId) => {
    if(stockPurchasedItem>0) {
        return Item.decrement({stock: 1}, {where: {UserId: SellerId, id: itemId}})
    }
}

const countSaldoBuyer = (priceItem, BuyerId) => {
    return Saldo.decrement({amount:  priceItem}, {where: {id: BuyerId}})
}

const countSaldoSeller = (priceItem, SellerId) => {
    return Saldo.increment({amount:  priceItem}, {where: {id: SellerId}})
}

const countAddSaldoBuyer = (topUp, BuyerId) => {
    return Saldo.increment( {amount : topUp}, {where: {UserId: BuyerId}})
}

module.exports = {countStock, countSaldoBuyer, countSaldoSeller, countAddSaldoBuyer}