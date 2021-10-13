const mongoose = require("mongoose");
const RecipeIngredient = require("./recipeIngredient");

const MenuItemSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  ingredients: [RecipeIngredient.schema]
});

const MenuItem = mongoose.model("menuItem", MenuItemSchema);
module.exports = MenuItem;
