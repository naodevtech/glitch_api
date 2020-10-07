const express = require('express');

const { OK, NOT_FOUND } = require('../helpers/status_codes');

const mainRouter = express.Router();

mainRouter.get('/', (request, response, next) => {
  response.status(OK).json({
    message: "Bienvenue dans l'API Facebook-clone 🚀",
  });
  next();
});

mainRouter.get('/*', (request, response, next) => {
  response.status(NOT_FOUND).json({
    error: 'Erreur 404 ❌',
  });
  next();
});

module.exports = mainRouter;
