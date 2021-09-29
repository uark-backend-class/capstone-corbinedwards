const mongoose = require("mongoose");
const RecipeIngredient = require("./recipeIngredient");

const MenuItemSchema = new mongoose.Schema({
  name: String,
  ingredients: [RecipeIngredient.Schema]
});

const MenuItem = mongoose.model("menuItem", MenuItemSchema);
module.exports = MenuItem;
