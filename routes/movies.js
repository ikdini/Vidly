const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  // get movie
  const movie = await Movie.findById(req.params.id);
  // if movie doesn't exist
  if (!movie) {
    return res.status(404).send("The movie with the ID doesn't exist");
  }
  // display movie
  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  // validate movie
  const { error } = validateMovie(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    return res.status(404).send("The genre with the ID doesn't exist");
  }

  const movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: { _id: genre._id, name: genre.name },
  });

  await movie.save();
  res.send(movie);
});

router.put("/:id", auth, async (req, res) => {
  // validate movie
  const { error } = validateMovie(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    return res.status(400).send("Invalid genre.");
  }

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
      },
    },
    { new: true }
  );

  if (!movie) {
    return res.status(404).send("The movie with the ID doesn't exist");
  }
  res.send(movie);
});

router.delete("/:id", auth, async (req, res) => {
  // get movie with ID
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) {
    return res.status(404).send("The movie with the ID doesn't exist");
  }

  // delete movie
  res.send(movie);
});

module.exports = router;
