const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./routes");

const server = express();

server.use("/api", cors());
server.use(helmet());
server.use(logger("tiny"));
server.use(bodyParser.json());

server.use("/api", routes);

module.exports = server;
