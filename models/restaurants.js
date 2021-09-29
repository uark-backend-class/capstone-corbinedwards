const mongoose = require("mongoose");
const MenuItem = require("./menuItem");

const RestaurantSchema = new mongoose.Schema({
  name: String,
  location: Object,
  menu: [MenuItem.Schema]
});

const Restaurant = mongoose.model("restaurant", RestaurantSchema);
module.exports = Restaurant;
