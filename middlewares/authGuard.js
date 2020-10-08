require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_SIGN;

const { UNAUTHORIZED } = require('../helpers/status_codes');

module.exports = {
  checkWithJWT: async (request, response, next) => {
    let token =
      request.headers['x-access-token'] || request.headers['authorization'];
    if (!!token) {
      token = token.slice(7, token.length);
    }

    if (token) {
      jwt.verify(token, SECRET_KEY, (error, decoded) => {
        if (error) {
          return response.status(UNAUTHORIZED).json({
            error: 'Veuillez vous connecter, votre session à expirée ❌',
          });
        } else {
          request.decoded = decoded;
          const expireIn = 24 * 60 * 60;
          const newToken = jwt.sign(
            {
              user: decoded.user,
            },
            SECRET_KEY,
            {
              expiresIn: expireIn,
            }
          );
          response.header('Authorization', 'Bearer', +newToken);
          next();
        }
      });
    } else {
      return response.status(UNAUTHORIZED).json({
        error: 'Veuillez vous connecter 🌐',
      });
    }
  },
};
