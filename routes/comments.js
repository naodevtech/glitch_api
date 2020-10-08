const express = require('express');
const authGard = require('../middlewares/authGuard');

const commentsController = require('../controllers/commentsController');

const commentsRouter = express.Router();

commentsRouter.post(
  '/posts/:id/comments',
  authGard.checkWithJWT,
  commentsController.addComment
);

commentsRouter.get(
  '/posts/:id/comments',
  authGard.checkWithJWT,
  commentsController.getCommentsByPost
);
module.exports = commentsRouter;
