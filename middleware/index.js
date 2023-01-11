const auth = (req, res, next) => {
  if (!req.session.email || !req.session.password) {
    const msg = "login first!"
    res.redirect(`/users/login?validationLogin=${msg}`)
  } else {
    next()
  }
}

module.exports = { auth }