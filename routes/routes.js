const express = require("express");
const restaurantController = require("../controllers/restaurants-controller");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello");
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
