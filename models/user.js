const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Recipe = require("./recipe");

const UserSchema = new mongoose.Schema({
  recipes: [Recipe.schema]
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("user", UserSchema);
module.exports = User;
