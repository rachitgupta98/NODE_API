const jwt = require("jsonwebtoken");

const withAuth = function(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, "secret", function(err, decoded) {
      if (err) {
        res.status(500).send("Unauthorized: Invalid token");
      } else {
        req.body.username = decoded.users.username;
        next();
      }
    });
  }
};
module.exports = withAuth;
