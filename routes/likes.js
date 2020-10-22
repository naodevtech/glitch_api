const express = require("express");
const authGard = require("../middlewares/authGuard");

const likesController = require("../controllers/likesController");

const likesRouter = express.Router();

likesRouter.post(
  "/post/:id/likes",
  authGard.checkWithJWT,
  likesController.addlike
);

likesRouter.get(
  "/post/:id/likes",
  authGard.checkWithJWT,
  likesController.getPostLikes
);

module.exports = likesRouter;
