require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const models = require("../models");
const fs = require("fs");

// Fonction création utilisateur
exports.register = (req, res) => {
  var email = req.body.email;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var password = req.body.password;


  if (email === "" || firstname === "" || password === "" || lastname === "") {
    return res.status(400).json({ error: " il manque des informations ! " });
  }

  models.User.findOne({
    attributes: ["email"],
    where: { email: req.body.email },
  })
    .then(function (userFound) {
      if (!userFound) {
        bcrypt.hash(password, 10, function (err, bcryptedPassword) {
          var newUser = models.User.create({
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: bcryptedPassword,
            isAdmin: 0,
          })
            .then(function (newUser) {
              return res.status(201).json({
                userId: newUser.id,
              });
            })
            .catch(function (error) {
              return res.status(500).json({ error });
            });
        });
      } else {
        return res.status(409).json({ error: " 'l'utilisateur existe déjà " });
      }
    })
    .catch(function (error) {
      return res
        .status(500)
        .json({ error: "impossible de vérifier l'utilisateur" });
    });
};

// Fonction connexion utilisateur
exports.login = (req, res, next) => {
  models.User.findOne({
    where: { email: req.body.email },
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
          } else {
            res.status(200).json({
              message: "Utilisateur connecté",
              user: {
                firstname: user.firstname,
                lastname: user.lastname,
                isAdmin: user.isAdmin,
              },
              userId: user.id,
              isAdmin: user.isAdmin,
              token: jwt.sign(
                {
                  userId: user.id,
                  isAdmin: user.isAdmin,
                },
                process.env.SECRET_KEY,
                {
                  expiresIn: "24h",
                }
              ),
            });
          }
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllUsers = async (req, res, next) => {
  await models.User.findAll()
    .then((user) => res.status(201).json(user))
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneUser = async (req, res, next) => {
  const userId = req.params.userId;
  await models.User.findOne({
    where: { id: userId },
  })
    .then((user) => res.status(201).json(user))
    .catch((error) => res.status(500).json({ error }));
};

exports.logout = (req, res) => {
  res.clearCookie("jwt", {
    domain: "localhost",
    path: "/",
    maxAge: 2 * 60 * 60 * 1000,
    secure: true,
    httpOnly: true,
  });
  res.send("utilisateur déconnecté");
};

exports.updateUser = (req, res) => {
  console.log(req.file);
  const userId = req.params.userId;
  var email = req.body.email;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var password = req.body.password;

  console.log(req.params.userId);

  bcrypt.hash(password, 10, function (err, bcryptedPassword) {
    models.User.findOne({ where: { id: userId } }).then((user) => {
      if (
        user.attachment ===
        `${req.protocol}://${req.get("host")}/images/default-avatar-300x300.png`
      ) {
        console.log("avatar déjà supprimé");
      } else {
        const filename = user.attachment.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          console.log("Avatar mis à jour");
        });
      }
    });

    models.User.update(
      {
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: bcryptedPassword,
        attachment: req.file
          ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
          : `${req.protocol}://${req.get(
              "host"
            )}/images/${"default-avatar-300x300.png"}`,
      },
      {
        where: {
          id: userId,
        },
      }
    )
      .then(() => res.status(200).json({ message: "profil mis à jour" }))
      .catch((error) => res.status(500).json({ error }));
  });
};

exports.deleteImageProfil = (req, res, next) => {
  const userId = req.params.userId;
  

  models.User.findOne({ where: { id: userId } }).then((user) => {
    const filename = user.attachment.split("/images/")[1];
    if (
      user.attachment !== null && filename !== "default-avatar-300x300.png"
    ) {

      fs.unlink(`images/${filename}`, () => {
            console.log("Avatar mis à jour");
             });
      console.log('youhou')
      models.User.update(
        {
          attachment: `${req.protocol}://${req.get(
            "host"
          )}/images/${"default-avatar-300x300.png"}`,
        },
        {
          where: {
            id: userId,
          },
        }
      )
        .then(() => res.status(200).json({ message: "profil mis à jour" }))
        .catch((error) => res.status(500).json({ error }));
    } else {
      const filename = user.attachment.split("/images/")[1];
      console.log(filename);
      console.log('zut')
      
          if (filename === "default-avatar-300x300.png") {
              console.log("Votre avatar a déjà été supprimé");
            } 
    }
  });
};

exports.deleteAccount = (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);
  models.User.findOne({
    where: { id: userId },
  })
    .then((valid) => {
      if (!valid) {
        return res.status(401).json({ error: "Utilisateur non trouvé" });
      } else {
        models.User.destroy({ where: { id: userId } }).then(() =>
          res.status(200).json({ message: "Utilisateur supprimé" })
        );
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteAccountbyAdmin =(req,res,next)=>{

  const userId = req.params.userId;
  console.log(userId)

  models.User.findOne({
    where: { id: userId },
  })
    .then((valid) => {
      if (!valid) {
        return res.status(401).json({ error: "Utilisateur non trouvé" });
      } else {
        models.User.destroy({ where: { id: userId } }).then(() =>
          res.status(200).json({ message: "Utilisateur supprimé" })
        );
      }
    })
    .catch((error) => res.status(500).json({ error }));
  


}
