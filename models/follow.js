"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Follow.belongsTo(models.User, {
        as: "follower",
        foreignKey: {
          allowNull: false,
          name: "followerId",
        },
      });
      models.Follow.belongsTo(models.User, {
        as: "followed",
        foreignKey: {
          allowNull: false,
          name: "followedId",
        },
      });
    }
  }
  Follow.init(
    {
      followedId: DataTypes.INTEGER,
      followerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Follow",
    }
  );
  return Follow;
};
