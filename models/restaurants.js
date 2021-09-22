const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required"]
  }
});

const Restaurant = mongoose.model("restaurant", RestaurantSchema);
module.exports = Restaurant;
