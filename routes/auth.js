const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
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

  const token = user.generateAuthToken();
  res.send(token);
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
