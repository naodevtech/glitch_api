const bcrypt = require("bcrypt");

const models = require("../models");
const jwtUtils = require("../helpers/jwt_utils");

const {
  OK,
  CREATED,
  CONFLICT,
  BAD_REQUEST,
  SERVER_ERROR,
  FORBIDDEN,
  NOT_FOUND,
} = require("../helpers/status_codes");

const checkEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
let checkPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

function isString(value) {
  return typeof value === "string" || value instanceof String;
}

module.exports = {
  signup: async (request, response) => {
    const user = {
      lastname: request.body.lastname,
      firstname: request.body.firstname,
      username: request.body.username,
      email: request.body.email,
      password: request.body.password,
      avatar: request.body.avatar,
    };

    // for (const key in user) {
    // 	if (user[key] == null) {
    // 		return response.status(BAD_REQUEST).json({
    // 			error: `Le champs ${key} n'est pas renseigné ❌`,
    // 		});
    // 	}
    // }

    // for (const key in user) {
    // 	if (!isString(user[key])) {
    // 		return response.status(BAD_REQUEST).json({
    // 			error: `Le champs ${key} n'est pas une chaîne de caractères ❌`,
    // 		});
    // 	}
    // }

    if (!checkEmail.test(user.email)) {
      return response.status(BAD_REQUEST).json({
        error: `Le champ email est mal renseigné ex:hello@contact.com ❌`,
      });
    }

    if (!checkPassword.test(user.password)) {
      return response.status(BAD_REQUEST).json({
        error: `Le mot de passe doir contenir au moins 1 majuscule un chiffre un caractère spécial et 8 et 15 caractères❌`,
      });
    }
    if (user.avatar == null) {
      user.avatar =
        "https://images.lpcdn.ca/924x615/201704/03/1378796-depuis-sept-ans-quiconque-creait.jpg";
    }

    const userExist = await models.User.findOne({
      attributes: ["email"],
      where: { email: user.email },
    });

    if (userExist) {
      return response.status(CONFLICT).json({
        error: `Un compte existe déjà avec l'email : ${user.email} ❌`,
      });
    } else {
      bcrypt.hash(user.password, 5, async (err, bcryptedPassword) => {
        const newSubscriber = await models.User.create({
          lastname: user.lastname,
          firstname: user.firstname,
          username: request.body.username,
          email: user.email,
          password: bcryptedPassword,
          avatar: user.avatar,
        });
        if (newSubscriber) {
          return response.status(CREATED).json({
            message: `Bienvenue à toi ${user.firstname}, n'hésite pas à commencer à rédiger ton premier post ! 🚀`,
            newSubscriber: {
              lastname: user.lastname,
              firstname: user.firstname,
              username: request.body.username,
              email: user.email,
              avatar: user.avatar,
            },
          });
        } else {
          return response.status(SERVER_ERROR).json({
            error: "Serveur cassé, réessayez plus tard. 🤯",
          });
        }
      });
    }
  },

  signin: async (request, response) => {
    const user = {
      email: request.body.email,
      password: request.body.password,
    };
    for (const key in user) {
      if (user[key] == null) {
        return response.status(BAD_REQUEST).json({
          error: `Le champs ${key} n'est pas renseigné ❌`,
        });
      }
    }

    const userExist = await models.User.findOne({
      attributes: [
        "id",
        "lastname",
        "firstname",
        "username",
        "email",
        "password",
        "avatar",
      ],
      where: {
        email: user.email,
      },
    });

    if (userExist) {
      bcrypt.compare(
        user.password,
        userExist.password,
        async (error, bcryptResponse) => {
          const userConnected = {
            id: userExist.id,
            firstname: userExist.firstname,
            lastname: userExist.lastname,
            username: userExist.username,
            email: userExist.email,
            avatar: userExist.avatar,
          };
          if (bcryptResponse) {
            return response.status(OK).json({
              token: jwtUtils.userGenerateToken(userConnected),
              userConnected,
            });
          } else {
            response.status(FORBIDDEN).json({
              error: "Votre mot de passe est incorrect ! ❌",
            });
          }
        }
      );
    } else {
      return response.status(NOT_FOUND).json({
        error: `Ce compte n'existe pas à cette adresse e-mail : ${user.email} ❌`,
      });
    }
  },
};
