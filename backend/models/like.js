'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      models.Like.belongsTo(models.User,{
        onDelete: "Cascade",
        foreignKey:{
          allowNull : false
        }
      })

      models.Like.belongsTo(models.Message, {
        onDelete: "Cascade",
        foreignKey: {
            allowNull: false
        }
      });
    }
  }
  Like.init({
    MessageId : DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};