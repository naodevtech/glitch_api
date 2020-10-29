const express = require("express");

const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (request, file, cb) {
    cb(null, file.originalname, file.originalname);
  },
});

var upload = multer({ storage: storage }).single("avatar");

const authController = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/signup", upload, authController.signup);

authRouter.post("/signin", authController.signin);

module.exports = authRouter;
