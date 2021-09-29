const mongoose = require("mongoose");
const RecipeIngredient = require("./recipeIngredient");
const RecipeStep = require("./recipeStep");

const RecipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [RecipeIngredient.Schema],
  utensils: [String],
  steps: [RecipeStep.Schema] //recipeStep
});

const Recipe = mongoose.model("Recipe", RecipeSchema);
module.exports = Recipe;
