'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Message,{
        foreignKey:{
          allowNull : false,
        }
      })
      models.User.hasMany(models.Like)
      models.User.hasMany(models.Dislike)
    }
  }
  User.init({
    email: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    attachment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};