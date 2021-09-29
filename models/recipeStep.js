const mongoose = require("mongoose");
const RecipeIngredient = require("./recipeIngredient");

const RecipeStepSchema = new mongoose.Schema({
  number: Number,
  ingredients: [RecipeIngredient.Schema],
  instructions: String
});

const RecipeStep = mongoose.model("recipeStep", RecipeStepSchema);

module.exports = RecipeStep;
