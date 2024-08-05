const JWT = require("jsonwebtoken");
const config = require("../config");

const checkToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  } 
    JWT.verify(token, config.SECRETKEY, (err, decoded) => {  
      if (err) {
        return res.status(500).json({ message: "Failed to authenticate token" });
      }

      req.Id = decoded.id;
      next();
    });
  }

module.exports = checkToken;
