const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
  // validate user
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check if user already exists
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid email or password.");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password.");
  }

  // const { accessToken, refreshToken } = user.generateAuthToken();

  const accessToken = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    config.get("jwtPrivateAccessKey"),
    { expiresIn: "1m", algorithm: "HS256" }
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    config.get("jwtPrivateRefreshKey"),
    { expiresIn: "24h", algorithm: "HS256" }
  );

  res
    .header({ "X-Access-Token": accessToken, "X-Refresh-Token": refreshToken })
    .send({ accessToken, refreshToken });
  // res.send(`X-Authorization: Bearer ${token}`);
  // res.send({ "X-Authorization": "Bearer " + token });
});

router.get("/logout", async (req, res) => {
  res
    .header({ "X-Access-Token": "", "X-Refresh-Token": "" })
    .send("Logged out.");
});

function validate(req) {
  // define schema constraints
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(250).email(),
    password: Joi.string().min(5).max(250).required(),
  });
  return schema.validate(req);
}

module.exports = router;
