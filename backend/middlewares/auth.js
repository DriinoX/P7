const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  //Get the token in headers
  const { authorization } = req.headers;
  //Verify the token and add userId and admin in request
  try {
    const token = authorization.split(" ")[1];
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