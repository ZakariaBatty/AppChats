require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt'); //for recover the images
const fs = require('fs');

const signin = (req, res) => {
  // get one user
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) res.json({ message: 'Acune donnée trovée' });

    user.comparePassword(req.body.password, function (err, isMatch) {
      if (!isMatch) {
        res.json({ error: 'Email and password doesnot match' });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.cookie('t', token, {
        expire: new Date() + 9999,
      });

      // user.profile.hashed_password = undefined;
      // user.profile.salt = undefined;

      return res.json({
        token,
        user,
      });
    });
  });
};

const signout = (req, res) => {
  res.clearCookies('t');
  res.json({ message: Déconnecté });
};

// middlewares
const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth',
  algorithms: ['HS256'],
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.json({ statuserror: 'Non authorisé' });
  }
  next();
};

module.exports = {
  signin,
  signout,
  hasAuthorization,
  requireSignin,
};
