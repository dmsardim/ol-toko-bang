const { Op } = require('sequelize')
const { Item, Tag, User, Balance } = require('../models')
class Controller {
    static home(req, res) {
        let data = {}
        const { tag, search, sort } = req.query
        const id = req.session.user ? req.session.user.id : 0

        const options = {
            where: {
                name: {
                    [Op.iLike]: `%${search || ''}%`
                }
            },
            order: [['name', 'ASC']],
        }

        if(sort) options.order = [['price', sort]]


        Tag.findAll({ attributes: ['id', 'name'], include: Item })
            .then(result => {
                data.tags = result
                return Balance.findOne({ where: { UserId: id } })
            })
            .then(balance => {
                data.balance = balance
                return Item.findAll(options)
            })
            .then(items => {
                if (tag && tag != 'all') {
                    let selectItems = data.tags.find(x => x.id == tag)
                    items = selectItems.Items
                }
                res.render('home', { items, ...data, query: req.query })
            })
            .catch(err => console.log(err))
    }
}

module.exports = Controller