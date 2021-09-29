const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  name: String,
  ingredients: [String]
});

const MenuItem = mongoose.model("menuItem", MenuItemSchema);
module.exports = MenuItem;
