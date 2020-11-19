const models = require("../models");

const jwtUtils = require("../helpers/jwt_utils");

const {
  OK,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
  SERVER_ERROR,
  FORBIDDEN,
} = require("../helpers/status_codes");

module.exports = {
  addlike: async (request, response) => {
    const userId = await jwtUtils.getUserId(
      request.headers.authorization,
      response
    );

    const postId = request.params.id;

    const postExist = await models.Post.findOne({
      where: { id: postId },
    });

    if (!postExist) {
      return response.status(NOT_FOUND).json({
        error:
          "Il semble il y avoir une erreur, le post n'existe peut-être plus réessayez plus tard ❌",
      });
    }

    const isAlreadyLiked = await models.Like.findOne({
      where: { userId: userId, postId: postId },
    });
    if (isAlreadyLiked) {
      return module.exports.dislikes(request, response);
    }
    const addLike = await models.Like.create({
      postId: postId,
      userId: userId,
    });

    if (addLike) {
      return response.status(CREATED).json({
        message: "Vous venez de liker ce post 🙏🏼",
      });
    } else {
      return response.status(SERVER_ERROR).json({
        error:
          "Il semble il y avoir une erreur, le post n'existe peut-être plus réessayez plus tard ❌",
      });
    }
  },

  dislikes: async (request, response) => {
    const userId = await jwtUtils.getUserId(
      request.headers.authorization,
      response
    );

    const postId = request.params.id;

    const postExist = await models.Post.findOne({
      where: { id: postId },
    });

    if (!postExist) {
      return response.status(NOT_FOUND).json({
        error:
          "Il semble il y avoir une erreur, le post n'existe peut-être plus réessayez plus tard ❌",
      });
    }

    const isLiked = await models.Like.findOne({
      attributes: ["userId"],
      where: { userId: userId, postId: postId },
    });

    if (!isLiked) {
      return module.exports.addlike(request, response);
    }

    const dislike = await models.Like.destroy({
      where: { userId: userId, postId: postId },
    });

    if (dislike) {
      return response.status(CREATED).json({
        message: "Vous venez de disliker ce post 🙏🏼",
      });
    } else {
      return response.status(SERVER_ERROR).json({
        error:
          "Il semble il y avoir une erreur, le post n'existe peut-être plus réessayez plus tard ❌",
      });
    }
  },

  getPostLikes: async (request, response) => {
    const postId = parseInt(request.params.id);

    const postExist = await models.Post.findOne({
      where: { id: postId },
    });

    if (!postExist) {
      return response.status(NOT_FOUND).json({
        error:
          "Il semble il y avoir une erreur lors de la récupération des likes du post, le post n'existe peut-être plus réessayez plus tard ❌",
      });
    }

    const likes = await models.User.findAll({
      attributes: ["username", "avatar"],
      required: true,
      nest: true,
      raw: true,
      include: [
        {
          model: models.Like,
          where: { postId: postId },
          attributes: ["userId"],
        },
      ],
    });

    if (likes) {
      return response.status(OK).json({ likes });
    } else {
      return response.status(NOT_FOUND).json({
        error: "Il semble il y avoir aucun likes sur ce post ❌",
      });
    }
  },
};
