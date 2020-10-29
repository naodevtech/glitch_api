const models = require("../models");

const jwtUtils = require("../helpers/jwt_utils");

const {
  OK,
  CREATED,
  SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} = require("../helpers/status_codes");

module.exports = {
  getUserInfos: async (request, response) => {
    const userId = request.params.id;

    if (!userId) {
      return response.status(UNAUTHORIZED).json({
        error:
          "Il semble qu'il y'a un problème lors de la récupération des posts de l'utiisateur via son ID❌",
      });
    }

    const userInfos = await models.User.findOne({
      attributes: [
        "id",
        "lastname",
        "firstname",
        "username",
        "email",
        "avatar",
      ],
      where: { id: userId },
    });

    const followers = await models.Follow.findAll({
      attributes: ["followerId"],
      where: { followedId: userId },
    });

    const followings = await models.Follow.findAll({
      attributes: ["followedId"],
      where: { followerId: userId },
    });

    if (followers) {
      return response.status(OK).json({
        id: userInfos.id,
        lastname: userInfos.lastname,
        firstname: userInfos.firstname,
        username: userInfos.username,
        email: userInfos.email,
        avatar: userInfos.avatar,
        followers: followers.length,
        followings: followings.length,
      });
    } else {
      return response.status(SERVER_ERROR).json({
        error: "Il semble y avoir une erreur. Réessayer plus tard. ❌",
      });
    }
  },

  searchUserByUsername: async (request, response) => {
    const userId = await jwtUtils.getUserId(
      request.headers.authorization,
      response
    );

    const searchTerm = request.query.searchTerm;

    if (!userId) {
      return response.status(UNAUTHORIZED).json({
        error:
          "Il semble qu'il y'a un problème lors de la récupération des posts de l'utiisateur via son ID❌",
      });
    }

    if (!searchTerm) {
      return response.status(NOT_FOUND).json({
        error: "Veuillez écrire un nom d'utilisateur afin de le rechercher ❌",
      });
    }
    const userExist = await models.User.findOne({
      attributes: ["id", "username", "avatar"],
      where: { username: searchTerm },
    });

    if (userExist) {
      return response.status(OK).json({ userExist });
    } else {
      return response.status(NOT_FOUND).json({
        error: "Il ne semble pas y avoir d'utilisateur portant ce nom 😭",
      });
    }
  },
};
