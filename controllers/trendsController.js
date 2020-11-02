const models = require("../models");

const jwtUtils = require("../helpers/jwt_utils");

const Sequelize = require("sequelize");

const Op = Sequelize.Op;

const operatorsAliases = {
  $like: Op.like,
  $not: Op.not,
};

const {
  OK,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
  SERVER_ERROR,
  FORBIDDEN,
} = require("../helpers/status_codes");

module.exports = {
  getAllPostsByTrendName: async (request, response) => {
    console.log(request.query.trendGame);

    if (!request.query.trendGame) {
      return console.log("no query");
    }

    const posts = await models.User.findAll({
      attributes: ["id", "username", "avatar"],
      required: true,
      raw: true,
      nest: true,
      include: [
        {
          model: models.Post,
          attributes: ["id", "userId", "content", "createdAt"],
          required: true,
          raw: true,
          nest: true,
          where: {
            content: {
              [Op.like]: `%${request.query.trendGame}%`,
            },
          },
        },
      ],
    });

    if (posts) {
      return response.status(OK).json({ posts });
    }
  },
};
