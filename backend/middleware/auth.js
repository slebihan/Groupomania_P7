//Package de générateur de token
const jwt = require('jsonwebtoken');

//Package pour les variables d'environnement //
require('dotenv').config()


//Middleware qui vérifie que le token correspond bien à l'userId //
// On vérifie que l'userId de la requête correspond à celle du token
// Si la requête est réussi celle-ci nous autorise à passer au middleware suivant

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.userId;
    req.auth = {userId} 
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};

module.exports = auth