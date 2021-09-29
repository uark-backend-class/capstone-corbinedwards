const mongoose = require("mongoose");

const RecipeIngredientSchema = new mongoose.Schema({
  name: String
});

const RecipeIngredient = mongoose.model(
  "recipeIngredient",
  RecipeIngredientSchema
);

module.exports = RecipeIngredient;
