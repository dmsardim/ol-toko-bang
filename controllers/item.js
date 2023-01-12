const {User, Item, Balance} = require('../models')
const { Op } = require('sequelize')
const {countStock, countBalanceBuyer, countBalanceSeller} = require('../helper')

class ControllerItem {
    static listItemSeller(req, res) {
        const { UserId } = req.params
        const { error, byItemName, byShopName } = req.query;
        let option = {
            include: [User],
            where: {},
            order: [['name', 'ASC']],
            order: [['price', 'ASC']]
        }
        if (UserId) {
            option.where = {
                UserId: +UserId
            }
        }
        if (byItemName) {
            option.where.name = {
                [Op.iLike]: `%${byItemName}%`
            }
        }
        // if(byShopName) {
        //     option.where = {
        //             User: {
        //                 name : {
        //                     [Op.iLike]: `%${byShopName}%`
        //                 } 
        //             }
        //     }
        // }
        let data = {}
        Item.findAll(option)
        .then((items) => {
            data.items = items;
            return User.findByPk(UserId, {include: Balance})
        })
        .then((user) => {
            res.render('list-item-seller', {...data, user, UserId, error})
        })
        .catch((err) => console.log(err))
    }

    static detailItem(req, res) {
        const { id } = req.params
        Item.findByPk(id)
            .then((item) => {
                res.render('items/detail', { item })
            })
            .catch((err) => res.send(err))
    }

    static formAddItem(req, res) {
        const { UserId } = req.params
        const { error } = req.query;
        User.findByPk(UserId)
            .then((user) => {
                res.render('form-add-item', { UserId, user, error })
            })
    }

    static submitAddItem(req, res) {
        const { UserId } = req.params
        const { name, price, stock, imageUrl } = req.body;
        const input = { name, price, stock, imageUrl, UserId }
        Item.create(input)
            .then(() => {
                res.redirect(`/items/seller/${UserId}`)
            })
            .catch((err) => {
                if (err.name === "SequelizeValidationError") {
                    let errMsg = err.errors.map((el) => el.message)
                    res.redirect(`/items/seller/${UserId}/add?error=${errMsg}`)
                } else {
                    res.send(err)
                }
            })
    }

    static formEditItem(req, res) {
        const { UserId, ItemId } = req.params;
        const { error } = req.query;
        Item.findByPk(ItemId)
            .then((item) => {
                res.render('form-edit-item-seller', { item, UserId, error })
            })
            .catch((err) => res.send(err))
    }

    static submitEditItem(req, res) {
        const { UserId, ItemId } = req.params;
        const { name, price, stock, imageUrl } = req.body;
        const input = { name, price, stock, imageUrl, UserId }
        Item.update(input, { where: { id: ItemId } })
            .then(() => {
                res.redirect(`/items/seller/${UserId}`)
            })
            .catch((err) => {
                if (err.name === "SequelizeValidationError") {
                    let errMsg = err.errors.map((el) => el.message)
                    res.redirect(`/items/seller/${UserId}/edit/${ItemId}?error=${errMsg}`)
                } else {
                    res.send(err)
                }
            })
    }

    static deleteItem(req, res) {
        const { UserId, ItemId } = req.params;
        // Item.destroy({where: {id: ItemId}})
        Item.findByPk(ItemId)
            .then((item) => {
                if (item.stock > 0) {
                    let errMsg = 'You cannot delete item with stock greather than 0!'
                    res.redirect(`/items/seller/${UserId}?error=${errMsg}`)
                } else if (item.stock == 0) {
                    Item.destroy({ where: { id: ItemId } })
                        .then(() => {
                            res.redirect(`/items/seller/${UserId}`)
                        })
                }
            })
            .catch((err) => res.send(err))
    }

    static updateItem(req, res) {
        const { UserId, ItemId } = req.params;
        Item.findByPk(ItemId)
            .then((item) => {
                if (item.stock === 0) {
                    Item.update({ isReady: false }, { where: { id: ItemId } })
                    res.redirect(`/items/seller/${UserId}`)
                } else {
                    Item.update({ isReady: true }, { where: { id: ItemId } })
                    res.redirect(`/items/seller/${UserId}`)
                }
            })
            .catch((err) => res.send(err))
    }

    static listItemForBuyer(req, res) {
        const { UserId } = req.params
        const { error, byItemName, byShopName } = req.query;
        let option = {
            include: [User],
            where: {},
            order: [['name', 'ASC']],
        }
        if (byItemName) {
            option.where.name = {
                [Op.iLike]: `%${byItemName}%`
            }
        }
        let data = {}
        Item.findAll(option)
        .then((items) => {
            let itemForBuyer = items.filter((el) => el.User.role==='seller')
            data.itemForBuyer = itemForBuyer;
            return  User.findByPk(UserId, {include: Balance})
        })
        .then((userBuyer) => {
            // console.log(data.itemForBuyer[0].User);
            res.render('list-item-for-buyer', {...data, userBuyer, UserId, error})
        })
        .catch((err) => res.send(err))
    }


    static listBuyer(req, res) {
        User.findAll({ include: Item })
            .then((users) => {
                let buyer = users.filter((el) => el.role === 'buyer')
                res.render('list-buyer', { buyer })
            })
            .catch((err) => res.send(err))
    }

    static buyItem(req, res) {
        const { UserId, ItemId } = req.params;
        let data = {}
        Item.findByPk(ItemId)
        .then((purchasedItem) => {
            data.purchasedItem = purchasedItem;
            return User.findByPk(UserId, {include: Balance})
        })
        .then((buyer) => {
            if(data.purchasedItem.isReady===false || data.purchasedItem.stock===0) {
                let errMsg = `Cannot buy item with stock 0, Pak ${buyer.name}!`
                res.redirect(`/items/buyer/${UserId}?error=${errMsg}`)
            } else if(buyer.Balance.dataValues.amount < data.purchasedItem.price) {
                let errMsg = `Your balance is not nyampe Pak ${buyer.name}, kuy top up!`
                res.redirect(`/items/buyer/${UserId}?error=${errMsg}`)
            }  else {
                Item.findByPk(ItemId)
                .then((purchasedItem) => {
                    data.purchasedItem = purchasedItem;
                    const {name, price, stock, imageUrl} = purchasedItem;
                    let input = {name, price, stock : 0, imageUrl, UserId}
                    return Item.create(input)
                })
                .then(() => {
                    let stockPurchasedItem = data.purchasedItem.stock;
                    let sellerId = data.purchasedItem.UserId
                    let itemId = data.purchasedItem.id
                    countStock(sellerId, stockPurchasedItem, itemId)
                    if(countStock) {
                        if(stockPurchasedItem == 1) {
                            Item.update({isReady: false}, {where: {id: itemId}})
                        }
                    }
                    return Balance.findOne({where: {UserId: UserId}})
                })
                .then((balanceBuyer) => {
                    countBalanceBuyer(data.purchasedItem.price, balanceBuyer.id)
                    let SellerId = data.purchasedItem.UserId
                    return Balance.findOne({where: {UserId: SellerId}})
                })
                .then((balanceSeller) => {
                    countBalanceSeller(data.purchasedItem.price, balanceSeller.id)
                    res.redirect(`/items/buyer/${UserId}`)
                })
                .catch((err) => res.send(err))
            }
        })
    }
}

module.exports = ControllerItem