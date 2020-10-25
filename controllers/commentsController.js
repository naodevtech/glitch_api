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
  addComment: async (request, response) => {
    const userId = await jwtUtils.getUserId(
      request.headers.authorization,
      response
    );

    const postId = parseInt(request.params.id);

    const comment = {
      content: request.body.content,
      postId: postId,
      userId: userId,
    };
    console.log("hello", comment);

    if (!comment.content) {
      return response.status(BAD_REQUEST).json({
        error: "Veuillez écrire un commentaire afin de le poster ❌",
      });
    }

    const postExist = await models.Post.findOne({
      where: { id: comment.postId },
    });

    if (!postExist) {
      return response.status(NOT_FOUND).json({
        error:
          "Il semble il y avoir une erreur, le post n'existe peut-être plus réessayez plus tard ❌",
      });
    }

    const commentSent = await models.Comment.create({
      content: comment.content,
      postId: comment.postId,
      userId: comment.userId,
    });

    if (commentSent) {
      return response.status(CREATED).json({
        message: "Votre commentaire à bien été envoyé 🚀",
        content: comment.content,
        postId: comment.postId,
        userId: comment.userId,
      });
    } else {
      return response.status(SERVER_ERROR).json({
        error: "Il semble il y avoir une erreur,  réessayez plus tard ❌",
      });
    }
  },

  getCommentsByPost: async (request, response) => {
    const postId = parseInt(request.params.id);

    const postExist = await models.Post.findOne({
      where: { id: postId },
    });

    if (!postExist) {
      return response.status(NOT_FOUND).json({
        error:
          "Il semble il y avoir une erreur, le post n'existe peut-être plus réessayez plus tard ❌",
      });
    }

    const comments = await models.User.findAll({
      attributes: ["id", "username", "avatar"],
      required: true,
      nest: true,
      raw: true,
      include: [
        {
          model: models.Comment,
          where: { postId: postId },
          required: true,
          attributes: ["content", "createdAt"],
        },
      ],
    });

    if (comments) {
      return response.status(CREATED).json({ comments });
    } else {
      return response.status(NOT_FOUND).json({
        error:
          "Il semble qu'il n'y a pas de commentaires sur ce post, réessayez plus tard ❌",
      });
    }
  },
};
