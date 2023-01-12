const { Item } = require('../models')
class Controller {
    static home(req, res) {
        Item.findAll()
            .then(items => res.render('home', { items }))
            .catch(err => res.send(err))
    }
}

module.exports = Controller