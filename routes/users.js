const express = require("express");
const authGard = require("../middlewares/authGuard");

const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");

const usersRouter = express.Router();

usersRouter.get(
  "/users/:id",
  authGard.checkWithJWT,
  usersController.getUserInfos
);

usersRouter.get(
  "/users",
  authGard.checkWithJWT,
  usersController.searchUserByUsername
);

usersRouter.patch(
  "/users",
  authGard.checkWithJWT,
  usersController.updateUserEmail
);

usersRouter.delete(
  "/users",
  authGard.checkWithJWT,
  usersController.deleteAccount
);

module.exports = usersRouter;
