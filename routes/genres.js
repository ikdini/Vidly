const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  // list all genres
  throw new Error("Could not get the genres.");
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  // get genre with ID
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    return res.status(404).send("The genre with the ID doesn't exist");
  }
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  // validate genre
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // create genre
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  // validate genre
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { $set: { name: req.body.name } },
    { new: true }
  );

  if (!genre) {
    return res.status(404).send("The genre with the ID doesn't exist");
  }
  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  // get genre with ID
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) {
    return res.status(404).send("The genre with the ID doesn't exist");
  }

  // delete genre
  res.send(genre);
});

module.exports = router;
