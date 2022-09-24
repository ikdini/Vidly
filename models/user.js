const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 250,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  // const accessToken = jwt.sign(
  //   { _id: this._id, isAdmin: this.isAdmin },
  //   config.get("jwtPrivateAccessKey"),
  //   { expiresIn: "1m" }
  // );

  // const refreshToken = jwt.sign(
  //   { _id: this._id, isAdmin: this.isAdmin },
  //   config.get("jwtPrivateRefreshKey"),
  //   { expiresIn: "24h" }
  // );
  // return { accessToken, refreshToken };

  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  // define schema constraints
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().required().min(5).max(250).email(),
    password: Joi.string().min(5).max(250).required(),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
