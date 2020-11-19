const models = require("../models");

const jwtUtils = require("../helpers/jwt_utils");

const {
  OK,
  CREATED,
  SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} = require("../helpers/status_codes");

const checkEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

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

  updateUserEmail: async (request, response) => {
    const userId = await jwtUtils.getUserId(
      request.headers.authorization,
      response
    );

    if (!userId) {
      return response.status(UNAUTHORIZED).json({
        error:
          "Il semble qu'il y'a un problème lors de la récupération des posts de l'utiisateur via son ID❌",
      });
    }

    const userExist = await models.User.findOne({
      where: { id: userId },
    });

    if (!userExist) {
      return response.status(UNAUTHORIZED).json({
        error: "Erreur lors de la récupération de l'utilisateur via l'ID ❌",
      });
    }

    const emailUser = request.body.email;

    if (!emailUser) {
      return response.status(NOT_FOUND).json({
        error: "Veuillez écrire une adresse-email ❌",
      });
    } else if (!checkEmail.test(emailUser)) {
      return response.status(BAD_REQUEST).json({
        error: `Le champ email est mal renseigné ex:jeandupont@domaine.com ❌`,
      });
    }

    const emailUpdated = await models.User.update(
      { email: emailUser },
      { where: { id: userId } }
    );

    if (emailUpdated) {
      return response.status(CREATED).json({
        message: "Votre email à bien été mis à jour 🌐",
        email: emailUser,
      });
    } else {
      return response.status(UNAUTHORIZED).json({
        error:
          "Il semble que ce compte ne vous appartiens pas (ID incorrect) ❌",
      });
    }
  },

  deleteAccount: async (request, response) => {
    const userId = await jwtUtils.getUserId(
      request.headers.authorization,
      response
    );

    if (!userId) {
      return response.status(UNAUTHORIZED).json({
        error:
          "Il semble qu'il y'a un problème lors de la récupération des posts de l'utiisateur via son ID❌",
      });
    }

    const userExist = await models.User.findOne({
      where: { id: userId },
    });

    if (!userExist) {
      return response.status(UNAUTHORIZED).json({
        error: "Erreur lors de la récupération de l'utilisateur via l'ID ❌",
      });
    }

    const accountDeleted = await models.User.destroy({
      where: { id: userId },
    });

    if (accountDeleted) {
      return response.status(OK).json({
        message: "Votre compte à bien été supprimé 😭",
      });
    } else {
      return response.status(UNAUTHORIZED).json({
        error:
          "Il semble que ce compte ne vous appartiens pas (ID : incorrect) ❌",
      });
    }
  },
};
