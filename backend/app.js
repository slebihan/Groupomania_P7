
require('dotenv').config()
const express = require('express')

const path = require('path');


const sequelize = require('./db/db')
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages')
const commentsRoutes = require('./routes/comments')


const app = express()
app.use(express.json())


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001','http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content,x-www-form-urlencoded, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

sequelize.sync()
.then((result)=>{
  console.log("Connexion à la base de donnée avec succès !")
})
.catch((err)=>{
  console.log(err)
})

app.use('/images',  express.static(path.join(__dirname,'/images')))
app.use('/api',userRoutes)
app.use('/api',messageRoutes)
app.use('/api',commentsRoutes)

module.exports = app