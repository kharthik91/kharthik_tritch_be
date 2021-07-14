const jwt = require("jsonwebtoken");

module.exports = {
  authenticated: async (req, res, next) => {
    //   check for jwt token in header
    const authToken = req.headers.auth_token;

    if (!authToken) {
      res.statusCode = 403;
      return res.json({
        message: `Not authorised`,
      });
    }

    // verify that jwt token is valid
    let decodedJWT = null;

    try {
      decodedJWT = await jwt.verify(authToken, process.env.JWT_SECRET);
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!decodedJWT) {
      res.statusCode = 403;
      return res.json({
        message: "unable to verify authorisation",
      });
    }

    next();
  },

  unauthenticated: (req, res, next) => {
    const authToken = req.headers.auth_token;

    if (!authToken) {
      next();
      return;
    }

    return res.json();
  },
};
