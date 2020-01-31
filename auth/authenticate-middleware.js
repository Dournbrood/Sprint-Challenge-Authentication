const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../config/banana");

module.exports = (request, response, next) => {
  const token = request.headers.authorization

  if (token) {
    jwt.verify(token, jwtSecret, (error, decodedToken) => {
      if (error) {
        response.status(401).json({ message: "Can't get in here without swimming the proper channels, bud." })
      }
      else {
        request.user = { ...decodedToken }
        console.log("REQUEST.USER IS", request.user)
        next();
      }
    })
  }
  else {
    response.status(401).json({ message: "No authorization header on request! Put in yer authentication token, darnit!" })
  }
};
