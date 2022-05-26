'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dislike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Dislike.belongsTo(models.User,{
        onDelete: "Cascade",
        foreignKey:{
          allowNull : false
        }
      })

      models.Dislike.belongsTo(models.Message, {
        onDelete: "Cascade",
        foreignKey: {
            allowNull: false
        }
      });
    }
  }
  Dislike.init({
    MessageId : DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Dislike',
  });
  return Dislike;
};