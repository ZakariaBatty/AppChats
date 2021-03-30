const express = require('express');
const router = express.Router();

// recover user Controller
const {
  createUser,
  getUserById,
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserPhoto,
  addFollower,
  removeFollowing,
  removeFollower,
  addFollowing,
} = require('../controllers/user.controller');
const {
  signin,
  hasAuthorization,
  requireSignin,
  signout,
} = require('../controllers/auth');

// the reuters
router.post('/api/users/create', createUser);
router.get('/api/user/:userId', getUser);
router.post('/api/auth/signin', signin);
router.get('/api/auth/signout', signout);
router.get('/api/users', requireSignin, getAllUsers);
router.get('/api/user/photo/:userId', requireSignin, getUserPhoto);
router.put('/api/users/:userId', requireSignin, hasAuthorization, updateUser);
router.delete(
  '/api/users/:userId',
  requireSignin,
  hasAuthorization,
  deleteUser
);
router
  .route('/api/user/add/fllow')
  .put(requireSignin, addFollowing, addFollower);

router
  .route('/api/user/remove/fllow')
  .put(requireSignin, removeFollowing, removeFollower);

router.param('userId', getUserById);

// exeport router
module.exports = router;
