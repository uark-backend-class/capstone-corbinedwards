const mongoose = require("mongoose");
const MenuItem = require("./menuItem");

const RestaurantSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  location: Object,
  menu: [MenuItem.schema]
});

const Restaurant = mongoose.model("restaurant", RestaurantSchema);
module.exports = Restaurant;
