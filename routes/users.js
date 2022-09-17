const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.post("/signup", async (req, res) => {
  // validate user
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check if user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User already registered.");
  }

  // create user
  user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // const { accessToken, refreshToken } = user.generateAuthToken();
  res
    // .header({ "X-Access-Token": accessToken, "X-Refresh-Token": refreshToken })
    .send(_.pick(user, ["_id", "name", "email"]));

  // res.send({
  //   name: user.name,
  //   email: user.email,
  // });
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

module.exports = router;
