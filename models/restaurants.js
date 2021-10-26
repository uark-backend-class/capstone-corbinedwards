//TODO: add a 'CreatedBy' & 'EditedBy' field

const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: String,
  location: Object,
  menu: [String]
});

const Restaurant = mongoose.model("restaurant", RestaurantSchema);
module.exports = Restaurant;
