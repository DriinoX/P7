const jwt = require("jsonwebtoken");
require("dotenv").config();

// Récuperation du token, décryptage du token et récuperation de l'userid et admin
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization;
    // const decodedToken = jwt.verify(token, process.env.TOKEN);
    const decodedToken = jwt.verify(token, "zadd163325");
    const userId = decodedToken.userId;
    const admin = decodedToken.admin;
    req.auth = {
      userId: userId,
      admin: admin,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};