const mongoose = require("mongoose");
const RecipeIngredient = require("./recipeIngredient");

const RecipeStepSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  number: Number,
  ingredients: [RecipeIngredient.schema],
  instructions: String
});

const RecipeStep = mongoose.model("recipeStep", RecipeStepSchema);

module.exports = RecipeStep;
