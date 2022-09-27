const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const Joi = require("joi");
const validate = require("../middleware/validate");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  // const rental = await Rental.findOne({
  //   "customer._id": req.body.customerId,
  //   "movie._id": req.body.movieId,
  // });
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  if (!rental) return res.status(404).send("Rental Not Found");

  if (rental.dateReturned)
    return res.status(400).send("Rental already processed");

  // rental.dateReturned = new Date();
  // const rentalDays = moment().diff(rental.dateOut, "days");
  // rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  rental.return();
  await rental.save();

  // const movie = await Movie.findById(req.body.movieId);
  // movie.numberInStock++;
  // await movie.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  res.send(rental);
});

function validateReturn(req) {
  // define schema constraints
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(req);
}

module.exports = router;
