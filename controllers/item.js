const { User, Item, Balance, Tag, ItemTag, sequelize } = require('../models')
const { Op } = require('sequelize')
const { countStock, countBalanceBuyer, countBalanceSeller } = require('../helper')

class ControllerItem {
    static listItemSeller(req, res) {
        const { UserId } = req.params
        const { id } = req.session.user
        const { error, byItemName } = req.query;
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



        let data = {}
        Item.findAll(option)
            .then((items) => {
                data.items = items;
                return User.findByPk(UserId, { include: Balance })
            })
            .then((user) => {
                data.user = user

                return sequelize.query(`SELECT sum(t."qty") AS "a",
                date_part('day', t."createdAt") AS "date"
                FROM "Transactions" t
                INNER JOIN "Items" i 
                ON t."ItemId" = i.id
                WHERE  status = 'checkout' AND t."UserId" = ${id}
                GROUP BY "date"`)
            })
            .then((stat) => {
                res.render('list-item-seller', { ...data, UserId, error, statistic: stat[0] })
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
        let data = {}
        User.findByPk(UserId)
            .then((user) => {
                data.user = user
                return Tag.findAll({ attributes: ['id', 'name'] })
            })
            .then(tags => {
                res.render('form-add-item', { UserId, ...data, tags, error })
            })
            .catch(err => res.send(err))
    }

    static submitAddItem(req, res) {
        const { UserId } = req.params
        const { name, price, stock, imageUrl, description, tags } = req.body;
        const input = { name, price, stock, imageUrl, UserId, description }
        Item.create(input)
            .then((item) => {
                const dataTags = tags.map(el => {
                    return { ItemId: item.id, TagId: el }
                })
                return ItemTag.bulkCreate(dataTags, {})

            })
            .then((_) => res.redirect(`/items/seller/${UserId}`))
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
                let itemForBuyer = items.filter((el) => el.User.role === 'seller')
                data.itemForBuyer = itemForBuyer;
                return User.findByPk(UserId, { include: Balance })
            })
            .then((userBuyer) => {
                // console.log(data.itemForBuyer[0].User);
                res.render('list-item-for-buyer', { ...data, userBuyer, UserId, error })
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
}

module.exports = ControllerItem