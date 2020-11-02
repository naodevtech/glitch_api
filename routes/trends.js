const express = require("express");
const authGard = require("../middlewares/authGuard");

const trendsController = require("../controllers/trendsController");

const trendsRouter = express.Router();

trendsRouter.get(
  "/trends",
  authGard.checkWithJWT,
  trendsController.getAllPostsByTrendName
);
module.exports = trendsRouter;
