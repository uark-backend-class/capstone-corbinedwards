const mongoose = require("mongoose");

const RecipeIngredientSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String
});

const RecipeIngredient = mongoose.model(
  "recipeIngredient",
  RecipeIngredientSchema
);

module.exports = RecipeIngredient;
