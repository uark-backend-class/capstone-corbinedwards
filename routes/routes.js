const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require('passport');

const User = require("../models/user");

const restaurantController = require("../controllers/restaurants-controller");

const TestSchema  = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String
});
const TestModel = mongoose.model("test", TestSchema);

router.get("/", (req, res) => {
  res.render('home', {layout: 'index'});
});

router
  .route("/login")
  .get((req, res) => {
    res.render('login', {layout: 'index'});
  })
  .post((req, res, next) => {
    res.status(201);
  });

router
  .route("/signup")
  .get((req, res) => {
    res.render('signup', {layout: 'index'});
  })
  .post((req, res, next) => {
    User.register(new User({username: req.body.username}), req.body.password, function(err) {
      if (err) {
        console.log('error while resgistering user!', err);
        return next(err);
      }
      
      console.log('user registered!');
    });
  });

router
  .route("/restaurants")
  .get((req, res) => {
    const restaurants = restaurantController.getAll();
    res.send(restaurants);
  })
  .post((req, res) => {
    console.log(req.body);
    if (req.body) {
      const newRestaurant = restaurantController.addOne(req.body);
      res.json(newRestaurant);
    } else {
      res.sendStatus(404);
    }
  });

router.get("/restaurants/:id", (req, res) => {
  const restaurant = restaurantController.getOne(req.params.id);

  if (restaurant) {
    res.send(restaurant);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
