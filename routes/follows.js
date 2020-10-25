const express = require("express");
const authGard = require("../middlewares/authGuard");

const followsController = require("../controllers/followsController");

const followsRouter = express.Router();

followsRouter.post(
  "/users/:id/follows",
  authGard.checkWithJWT,
  followsController.followToggle
);

// need debug
followsRouter.get(
  "/users/:id/followers",
  authGard.checkWithJWT,
  followsController.getUsersFollowersById
);

module.exports = followsRouter;
