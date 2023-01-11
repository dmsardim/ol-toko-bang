
class Controller {
    static home(req, res) {
        console.log(res.locals)
        res.render('home', { isAuth: true })
    }
}

module.exports = Controller