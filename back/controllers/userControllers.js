const userControllers = {};
const { users } = require("../models/index");
const { crearToken } = require("../middlewares/tokenControllers");

userControllers.registerUser = (req, res) => {
  users
    .create(req.body)
    .then((user) => {
      const token = crearToken(user);
      res.status(200).send(token);
    })
    .catch((err) => res.sendStatus(404));
};

userControllers.loginUser = (req, res) => {
  users
    .findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) res.sendStatus(401);
      if (!user.validPassword(req.body.password)) res.sendStatus(401);
      else {
        const token = crearToken(user);
        req.user = user;
        res.status(200).send(token);
      }
    })
    .catch((err) => res.sendStatus(404));
};

userControllers.subscribeFeeds = (req, res) => {
  console.log(req.body.feeds, "SUBSCRIBE");
  res.send(req.body.feeds);
};

userControllers.unsubscribeFeeds = (req, res) => {
  console.log(req.body.feeds);
  res.send(req.body.feeds);
};

module.exports = userControllers;
