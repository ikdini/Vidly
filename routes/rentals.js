const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
// const Fawn = require("fawn");
const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const auth = require("../middleware/auth");

// Fawn.init("mongodb://localhost/vidly");

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  // get rental
  const rental = await Rental.findById(req.params.id);
  // if rental doesn't exist
  if (!rental) {
    return res.status(404).send("The rental with the ID doesn't exist");
  }
  // display rental
  res.send(rental);
});

router.post("/", auth, async (req, res) => {
  // validate rental
  const { error } = validateRental(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    return res.status(404).send("The customer with the ID doesn't exist");
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    return res.status(404).send("The movie with the ID doesn't exist");
  }
  if (movie.numberInStock === 0) {
    return res.status(400).send("Movie not in stock.");
  }

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  rental = await rental.save();

  movie.numberInStock--;
  movie.save();
  res.send(rental);

  // try {
  //   new Fawn.Task()
  //     .save("rentals", rental)
  //     .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
  //     .run();

  //   res.send(rental);
  // } catch (ex) {
  //   res.status(500).send("Something failed.");
  // }

  // new Fawn.Task()
  //   .save("rentals", rental)
  //   .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
  //   .run()
  //   .then(function () {
  //     res.send(rental);
  //   })
  //   .catch(function (err) {
  //     console.log(err);
  //   });
});

module.exports = router;
