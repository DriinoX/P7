const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config()

// CREATION D'UN UTILISATEUR
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({
    email: email,
    username: username,
  });
  // Vérification si l'utilisateur existe pas
  if (!user) {
    // Si il n'existe pas création d'un utilisateur en hashant le mot de passe
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        User.create({
          username: username,
          admin: false,
          email: email,
          password: hash,
        });
        res.status(201).json("Nouvel utilisateur créé !");
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  } else if (user) {
    res.status(409).json("Username ou Email déjà utilisé !");
  }
};

// CONNEXION D'UN UTILISATEUR
exports.login = async (req, res) => {
  const { email, password } = req.body;
  // Vérifiaction si l'email et le password sont présent
  if (!email || !password) {
    res.status(400).json("Informations manquantes !");
  } else {
    const user = await User.findOne({ email: email });
    // Vérification si l'utilisateur existe
    if (!user) {
      return res.status(401).json("Informations incorrectes !");
    } else {
      // Si OUI, comparaison de mot de passe de la requete avec celui enregistré
      bcrypt
        .compare(password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json("Mauvaise combinaison Email/Mot de passe !");
          } else {
            let currentUser = {
              userId: user._id,
              username: user.username,
              admin: user.admin,
            };
            // Envoi de l'utilisateur et création du token d'authentification
            res.status(200).json({
              currentUser,
              token: jwt.sign(
                { userId: user._id, admin: user.admin },
                process.env.TOKEN,
                { expiresIn: "24h" }
              ),
            });
          }
        })
        .catch((error) => {
          res.status(400).json(error);
        });
    }
  }
};