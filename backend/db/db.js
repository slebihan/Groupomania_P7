const Sequelize  = require('sequelize');

const sequelize = new Sequelize('Groupomania','root','mysql',{dialect:'mysql',host:'127.0.0.1',port:'3306'})

module.exports =  sequelize;