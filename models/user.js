const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  savedRecipes: Array
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
