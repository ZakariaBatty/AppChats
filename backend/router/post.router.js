const express = require('express');
const router = express.Router();
const { requireSignin } = require('../controllers/auth');
const {
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
} = require('../controllers/post.controller');
const { getUserById } = require('../controllers/user.controller');

router.get('/api/posts/:userId', requireSignin, getAllPosts);
router.post('/api/post/create/:userId', requireSignin, addPost);

router.param('userId', getUserById);
module.exports = router;
