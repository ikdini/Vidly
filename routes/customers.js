const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  // get customer
  const customer = await Customer.findById(req.params.id);
  // if customer doesn't exist
  if (!customer) {
    return res.status(404).send("The customer with the ID doesn't exist");
  }
  // display customer
  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  // validate customer
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  await customer.save();
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  // validate customer
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
      },
    },
    { new: true }
  );

  if (!customer) {
    return res.status(404).send("The customer with the ID doesn't exist");
  }
  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  // get customer with ID
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) {
    return res.status(404).send("The customer with the ID doesn't exist");
  }

  // delete customer
  res.send(customer);
});

module.exports = router;
