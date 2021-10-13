const mongoose = require("mongoose");
const RecipeIngredient = require("./recipeIngredient");
const RecipeStep = require("./recipeStep");

const RecipeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  ingredients: [RecipeIngredient.schema],
  utensils: [String],
  steps: [RecipeStep.schema] //recipeStep
});

const Recipe = mongoose.model("Recipe", RecipeSchema);
module.exports = Recipe;
