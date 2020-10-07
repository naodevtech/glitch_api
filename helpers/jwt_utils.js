require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET_SIGN = process.env.JWT_SECRET_SIGN;

const { SERVER_ERROR, UNAUTHORIZED } = require('../helpers/status_codes');

module.exports = {
  userGenerateToken: (user) => {
    if (user) {
      return jwt.sign(
        {
          userId: user.id,
          lastname: user.lastname,
          firstname: user.firstname,
          avatar: user.avatar,
        },
        JWT_SECRET_SIGN,
        {
          expiresIn: '2h',
        }
      );
    }
  },
  parsingAuthorization: (authorization) => {
    return authorization != null ? authorization.replace('Bearer ', '') : null;
  },

  getUserId: async (requestAuthorization, response) => {
    let userId = -1;

    const token = await module.exports.parsingAuthorization(
      requestAuthorization
    );
    if (token) {
      const jwtToken = jwt.verify(token, JWT_SECRET_SIGN);
      if (!jwtToken) {
        return response.status(SERVER_ERROR).json({
          error:
            "Le token n'a pas pu être récupéré, veuillez réessayer plus tard ❌",
        });
      } else {
        userId = jwtToken.userId;
      }
    } else {
      return response.status(UNAUTHORIZED).json({
        error: "Vous n'êtes pas authorisé à accéder à cette ressource. ❌",
      });
    }
    return userId;
  },
};
