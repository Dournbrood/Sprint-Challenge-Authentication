const router = require('express').Router();
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/banana");

const Users = require("./users-model");

router.post('/register', (request, response) => {
  let user = request.body;
  const hash = bcrypt.hashSync(user.password, 10)
  user.password = hash;

  Users.add(user)
    .then((newUser) => {
      response.status(200).json({ ...newUser });
    })
    .catch((error) => {
      console.log(error)
      response.status(500).json({ message: "Wuh oh!" })
    })
});

router.post('/login', (request, response) => {
  let { username, password } = request.body;

  Users.findBy({ username })
    .then((foundUser) => {
      if (foundUser && bcrypt.compareSync(password, foundUser.password)) {

        const token = signToken(foundUser);

        response.status(200).json({
          message: `Welcome, ${foundUser.username}`,
          token: token
        });
      }
      else {
        response.status(401).json({ message: "Nope." });
      }
    })
    .catch((error) => {
      console.log(error)
      response.status(500).json({ message: "Wuh oh!" })
    })
});

function signToken(user) {
  const payload = {
    user,
  }

  const secret = jwtSecret;

  const options = {
    expiresIn: "2d",
  }

  return jwt.sign(payload, secret, options)
}

module.exports = router;
