const mongoose = require("mongoose");
const Recipe = require("./recipe");

const UserSchema = new mongoose.Schema({
  userName: String,
  recipes: [Recipe.Schema]
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
