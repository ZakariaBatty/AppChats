const User = require('../models/User');
const _ = require('lodash');
const formidable = require('formidable'); //for recover the images
const fs = require('fs');

// create user
const createUser = (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  user.save((err, user) => {
    if (err) res.json({ error: err });
    user.profile.hashed_password = undefined;
    user.profile.salt = undefined;
    res.json(user);
  });
};

// gett user by Id and get all users by following
const getUserById = (req, res, next, id) => {
  User.findById(id)
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, user) => {
      if (err || !user) res.json({ error: err });
      req.profile = user;
      next();
    });
};

// recover user
const getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  res.json(req.profile);
};

// get all users
const getAllUsers = (req, res) => {
  User.find((err, users) => {
    if (err || !users) res.json({ error: err });
    res.json(users);
  }).select('name email about image createdAt');
};

const updateUser = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) res.json({ error: "Impossible d'ajouter le fichier séléctioner" });
    let user = req.profile;
    user = _.extend(user, fields);
    if (files.image) {
      user.image.date = fs.readFileSync(files.image.path);
      user.image.contentType = files.image.type;
    }
    user.save((err, result) => {
      if (err) res.json({ error: err });
      result.profile.hashed_password = undefined;
      result.profile.salt = undefined;
      result.profile.image = undefined;
      res.json(result);
    });
  });
};

const deleteUser = (req, res) => {
  let user = res.profile;
  user.remove((err, detectedUser) => {
    if (err) res.json({ error: err });
    res.json({ message: 'Compte supprimé' });
  });
};

const getUserPhoto = (req, res) => {
  if (req.profile.image.date) {
    res.set('Content-Type', req.profile.image.contentType);
    return res.send(req.profile.image.date);
  } else {
    return res.sendFile(
      'C:/xampp/htdocs/reactsJs/appChats/backend/images/user.jpg'
    );
  }
};

const addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $push: { following: req.body.followId } },
    { new: true },
    (err, result) => {
      if (err) res.json({ error: err });
      next();
    }
  );
};

const addFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.body.userId } },
    { new: true }
  )
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, result) => {
      if (err) res.json({ error: err });
      result.profile.hashed_password = undefined;
      result.profile.salt = undefined;
      result.profile.image = undefined;
      res.json(result);
    });
};

const removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $pull: { following: req.body.unfollowId } },
    { new: true },
    (err, result) => {
      if (err) res.json({ error: err });
      next();
    }
  );
};

const removeFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: req.body.userId } },
    { new: true }
  )
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, result) => {
      if (err) res.json({ error: err });
      result.profile.hashed_password = undefined;
      result.profile.salt = undefined;
      result.profile.image = undefined;
      res.json(result);
    });
};

module.exports = {
  createUser,
  getUserById,
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
};
