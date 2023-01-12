const {Item, Balance} = require('../models')

const countStock = (SellerId, stockPurchasedItem, itemId) => {
    if(stockPurchasedItem>0) {
        return Item.decrement({stock: 1}, {where: {UserId: SellerId, id: itemId}})
    }
}

const countBalanceBuyer = (priceItem, BuyerId) => {
    return Balance.decrement({amount:  priceItem}, {where: {id: BuyerId}})
}

const countBalanceSeller = (priceItem, SellerId) => {
    return Balance.increment({amount:  priceItem}, {where: {id: SellerId}})
}

const countAddBalanceBuyer = (topUp, BuyerId) => {
    return Balance.increment( {amount : topUp}, {where: {UserId: BuyerId}})
}

module.exports = {countStock, countBalanceBuyer, countBalanceSeller, countAddBalanceBuyer}