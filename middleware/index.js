const auth = (req, res, next) => {
  if (!req.session.user) {
    const msg = "login first!"
    res.redirect(`/users/login?validationLogin=${msg}`)
  } else {
    next()
  }
}

const isBuyer = (req, res, next) => {
  // console.log(req.session);
  if(req.session.user.role != "buyer") {
      const msg = "you're not a buyer!"
      res.redirect(`/?validationLogin=${msg}`)
  } else {
      next()
  }
}

const isSeller = (req, res, next) => {
  if(req.session.user.role != "seller") {
      const msg = "you're not a seller!"
      res.redirect(`/?validationLogin=${msg}`)
  } else {
      next()
  }
}

module.exports = { auth , isBuyer, isSeller}