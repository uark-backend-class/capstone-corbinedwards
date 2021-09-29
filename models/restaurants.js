const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: String,
  menu: [String]
});

const Restaurant = mongoose.model("restaurant", RestaurantSchema);
module.exports = Restaurant;
