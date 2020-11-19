"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Post, {
        onDelete: "cascade",
        hooks: true,
      });
      models.User.hasMany(models.Follow, {
        onDelete: "cascade",
        hooks: true,
      }),
        models.User.hasMany(models.Comment, {
          onDelete: "cascade",
          hooks: true,
        });
      models.User.hasMany(models.Like, {
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  User.init(
    {
      lastname: DataTypes.STRING,
      firstname: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
