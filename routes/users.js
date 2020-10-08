const express = require('express');
const authGard = require('../middlewares/authGuard');

const usersController = require('../controllers/usersController');

const usersRouter = express.Router();

usersRouter.get(
  '/users/:id',
  authGard.checkWithJWT,
  usersController.getUserInfos
);

module.exports = usersRouter;
