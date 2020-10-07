const express = require('express');
const authGard = require('../middlewares/authGuard');

const postsController = require('../controllers/postsController');
const { deletePostById } = require('../controllers/postsController');

const postsRouter = express.Router();

postsRouter.post('/posts', authGard.checkWithJWT, postsController.addPost);

postsRouter.get('/posts', authGard.checkWithJWT, postsController.getAllPosts);

postsRouter.get(
  '/posts/:id',
  authGard.checkWithJWT,
  postsController.getPostById
);

postsRouter.delete(
  '/posts/:id',
  authGard.checkWithJWT,
  postsController.deletePostById
);

postsRouter.patch(
  '/posts/:id',
  authGard.checkWithJWT,
  postsController.updatePostById
);
module.exports = postsRouter;
