const models = require('../models');

const jwtUtils = require('../helpers/jwt_utils');

const {
  OK,
  CREATED,
  SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} = require('../helpers/status_codes');

module.exports = {
  addPost: async (request, response) => {
    const userId = await jwtUtils.getUserId(
      request.headers.authorization,
      response
    );

    const postInfos = {
      content: request.body.content,
      userId: userId,
    };

    if (!postInfos.content) {
      return response.status(NOT_FOUND).json({
        error: 'Veuillez écrire un post afin de le poster ❌',
      });
    }
    const postCreated = await models.Post.create({
      content: postInfos.content,
      userId: postInfos.userId,
    });
    if (postCreated) {
      return response.status(CREATED).json({
        message: 'Le post à bien été envoyé ! 🚀',
        content: postInfos.content,
      });
    } else {
      return response.status(SERVER_ERROR).json({
        message: 'Il semble y avoir une erreur, réessayer plus tard. ❌',
      });
    }
  },

  getAllPosts: async (request, response) => {
    const allPosts = await models.User.findAll({
      attributes: ['username', 'avatar'],
      required: true,
      raw: true,
      nest: true,
      include: [
        {
          model: models.Post,
          attributes: ['userId', 'content', 'createdAt'],
          required: true,
          raw: true,
        },
      ],
    });
    for (key in allPosts) {
      console.log(allPosts[key].Posts.content);
    }
    if (allPosts) {
      return response.status(OK).json({ allPosts });
    } else {
      return response.status(NOT_FOUND).json({
        error: "Il semble qu'il n'y a aucun posts' ❌",
      });
    }
  },

  getPostById: async (request, response) => {
    const postId = request.params.id;

    const postFoundByid = await models.Post.findOne({
      attributes: ['id', 'content', 'userId', 'createdAt'],
      where: { id: postId },
    });

    if (postFoundByid) {
      return response.status(OK).json({ postFoundByid });
    } else {
      return response.status(NOT_FOUND).json({
        error: "Il semble que ce post n'existe pas ou plus ❌",
      });
    }
  },

  deletePostById: async (request, response) => {
    const userId = await jwtUtils.getUserId(
      request.headers.authorization,
      response
    );

    const postId = parseInt(request.params.id);

    const postExist = await models.Post.findOne({
      where: { id: postId },
    });

    if (!postExist) {
      return response.status(SERVER_ERROR).json({
        error:
          'Il semble y avoir une erreur, votre post à peut-être déjà été supprimé. Réessayer plus tard. ❌',
      });
    }

    const postDeleted = await models.Post.destroy({
      where: { id: postId, userId: userId },
    });

    if (postDeleted) {
      return response.status(OK).json({
        message: 'Votre post à bien été supprimé 😭',
      });
    } else {
      return response.status(UNAUTHORIZED).json({
        error: 'Il semble que ce post ne vous appartiens pas ❌',
      });
    }
  },

  updatePostById: async (request, response) => {
    const userId = await jwtUtils.getUserId(
      request.headers.authorization,
      response
    );

    const postInfos = {
      content: request.body.content,
      userId: userId,
      postId: parseInt(request.params.id),
    };

    if (!postInfos.content) {
      return response.status(NOT_FOUND).json({
        error: 'Veuillez écrire un post afin de le poster ❌',
      });
    }

    const postExist = await models.Post.findOne({
      where: { id: postInfos.postId },
    });

    if (postExist) {
      if (
        postExist.dataValues.id !== postInfos.postId ||
        postExist.dataValues.userId !== postInfos.userId
      ) {
        return response.status(UNAUTHORIZED).json({
          error: 'Il semble que ce post ne vous appartiens pas ❌',
        });
      }
    } else {
      return response.status(NOT_FOUND).json({
        error: "Il semble que ce post n'existe pas ou plus ❌",
      });
    }

    const postUpdated = await models.Post.update(
      { content: postInfos.content },
      { where: { userId: postInfos.userId, id: postInfos.postId } }
    );

    if (postUpdated) {
      return response.status(CREATED).json({
        message: 'Votre post à bien été mis à jour 🌐',
        content: postUpdated.content,
      });
    } else {
      return response.status(UNAUTHORIZED).json({
        error: 'Il semble que ce post ne vous appartiens pas ❌',
      });
    }
  },

  getUserPosts: async (request, response) => {
    const userId = request.params.id;

    if (!userId) {
      return response.status(UNAUTHORIZED).json({
        error:
          "Il semble qu'il y'a un problème lors de la récupération des posts de l'utiisateur via son ID❌",
      });
    }
    const posts = await models.Post.findAll({
      where: { userId: userId },
    });

    if (posts) {
      return response.status(OK).json({ posts });
    } else {
      return response.status(SERVER_ERROR).json({
        error: 'Il semble y avoir une erreur. Réessayer plus tard. ❌',
      });
    }
  },
};
