const express = require('express');

const { OK, NOT_FOUND } = require('../helpers/status_codes');

const authRouter = require('./auth');
const postsRouter = require('./posts');
const usersRouter = require('./users');
const followsRouter = require('./follows');
const commentsRouter = require('./comments');
const likesRouter = require('./likes');

const mainRouter = express.Router();

mainRouter.use(authRouter);
mainRouter.use(postsRouter);
mainRouter.use(usersRouter);
mainRouter.use(followsRouter);
mainRouter.use(commentsRouter);
mainRouter.use(likesRouter);

mainRouter.get('/', (request, response) => {
	return response.status(OK).json({
		message:
			"Bienvenue dans l'API Glitch, veuillez vous connecter afin de profiter pleinement des endpoints 🚀",
	});
});

mainRouter.get('/*', (request, response) => {
	return response.status(NOT_FOUND).json({
		error: 'Erreur 404 ❌',
	});
});

module.exports = mainRouter;
