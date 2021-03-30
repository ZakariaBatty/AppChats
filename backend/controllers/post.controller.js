const { json } = require('body-parser');
const Post = require('../models/Post');

//get all post where user following
const getAllPosts = (req, res) => {
  Post.find({ postedBy: { $in: req.profiles.following } })
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .sort('-createdAt')
    .exec((err, posts) => {
      if (err) res.json({ error: err });
      res.json(posts);
    });
};

// get post where post his had  relation that user
const userPosts = (req, res) => {
  Post.find({ postedBy: req.profiles._id })
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .sort('-createdAt')
    .exec((err, posts) => {
      if (err) res.json({ error: err });
      res.json(posts);
    });
};

// get posy where id post
const getPostById = (req, res, next, id) => {
  Post.find(id)
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, post) => {
      if (err) res.json({ error: err });
      res.post = post;
      next();
    });
};

// check if ypur post is owner
const isOwner = (req, res, next) => {
  let isMine = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isMine) {
    return res.json({ error: 'Nn authorisé' });
  }
  next();
};

// add new post
const addPost = (req, res) => {
  const { text } = req.body;
  let post = new Post({ text, postedBy: req.profiles });
  post.save((err, data) => {
    if (err) res.json({ error: err });
    res.json(data);
  });
};

// delete post where find post by id
const deletePost = (req, res) => {
  let postToDelete = req.post;
  postToDelete.remove((err, deletePost) => {
    if (err) res.json({ error: err });
    res.json({ message: 'Tweet supprimé' });
  });
};

// add like post
const likePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) res.json({ error: err });
    res.json(result);
  });
};

// unlike post
const unlikePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) res.json({ error: err });
    res.json(result);
  });
};

const addComment = (req, res) => {
  let comment = { text: req.body.text };
  comment.postedBy = req.body.userId;
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  ).exec((err, result) => {
    if (err) res.json({ error: err });
    res.json(result);
  });
};

const deleteComment = (req, res) => {
  let comment = req.body.comment;
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { comments: { _id: comment.id } } },
    { new: true }
  ).exec((err, result) => {
    if (err) res.json({ error: err });
    res.json(result);
  });
};

module.exports = {
  getAllPosts,
  addPost,
  userPosts,
  getPostById,
  isOwner,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
};
