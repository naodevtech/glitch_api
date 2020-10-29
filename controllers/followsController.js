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
  followToggle: async (request, response) => {
    userFollowed = parseInt(request.params.id);

    const userExist = await models.User.findOne({
      where: { id: userFollowed },
    });

    if (!userExist) {
      return response.status(NOT_FOUND).json({
        error: "Je ne craint que vous n'essayez de suivre un fantome 👻",
      });
    }
    const userId = await jwtUtils.getUserId(
      request.headers.authorization,
      response
    );

    if (userFollowed === userId) {
      return response.status(BAD_REQUEST).json({
        error: "Vous ne pouvez pas vous suivre vous-même 🤯",
      });
    }

    const alreadyFollowed = await models.Follow.findOne({
      attributes: ["id", "followedId", "followerId", "createdAt"],
      where: { followedId: userFollowed, followerId: userId },
    });

    if (alreadyFollowed) {
      return module.exports.unfollow(request, response);
    }

    const following = await models.Follow.create({
      where: { followedId: userFollowed },
      followedId: userFollowed,
      followerId: userId,
    });

    if (following) {
      return response.status(CREATED).json({
        message: `Vous venez de suivre ${userExist.dataValues.lastname} ${userExist.dataValues.firstname}`,
      });
    } else {
      return response.status(SERVER_ERROR).json({
        error: "Il semble y avoir une erreur, réessayez plus tard ❌",
      });
    }
  },

  unfollow: async (request, response) => {
    userFollowed = parseInt(request.params.id);

    const userExist = await models.User.findOne({
      where: { id: userFollowed },
    });

    if (!userExist) {
      return response.status(NOT_FOUND).json({
        error: "Je ne craint que vous n'essayez d'unfollow un fantome 👻",
      });
    }
    const userId = await jwtUtils.getUserId(
      request.headers.authorization,
      response
    );

    const unfollowing = await models.Follow.destroy({
      where: { followedId: userFollowed, followerId: userId },
    });

    if (unfollowing) {
      return response.status(CREATED).json({
        message: `Vous venez d'unfollow ${userExist.dataValues.lastname} ${userExist.dataValues.firstname}`,
      });
    } else {
      return response.status(SERVER_ERROR).json({
        error: "Il semble y avoir une erreur, réessayez plus tard ❌",
      });
    }
  },

  getUsersFollowersById: async (request, response) => {
    const userId = parseInt(request.params.id);

    if (!userId) {
      return response.status(UNAUTHORIZED).json({
        error:
          "Il semble qu'il y'a un problème lors de la récupération des posts de l'utiisateur via son ID❌",
      });
    }

    const followers = await models.Follow.findAll({
      attributes: ["followerId", "followedId"],
      where: { followedId: userId },
      include: [{ model: models.User, as: "follower", required: true }],
    });

    console.log(followers);

    if (followers) {
      return response.status(OK).json({ followers });
    } else {
      return response.status(SERVER_ERROR).json({
        error: "Il semble y avoir une erreur, réessayez plus tard ❌",
      });
    }
  },

  getUsersFollowingsById: async (request, response) => {
    const userId = parseInt(request.params.id);

    if (!userId) {
      return response.status(UNAUTHORIZED).json({
        error:
          "Il semble qu'il y'a un problème lors de la récupération des posts de l'utiisateur via son ID❌",
      });
    }

    const followings = await models.Follow.findAll({
      attributes: ["followerId", "followedId"],
      where: { followerId: userId },
      include: [{ model: models.User, as: "followed", required: true }],
    });

    if (followings) {
      return response.status(OK).json({ followings });
    } else {
      return response.status(SERVER_ERROR).json({
        error: "Il semble y avoir une erreur, réessayez plus tard ❌",
      });
    }
  },
};
