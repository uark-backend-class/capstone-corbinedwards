require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("cookie-session");
const handlebars = require("express-handlebars");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user");

mongoose.connect(process.env.MONGO_CONNECT), {useMongoClient: true};

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({
    layoutsDir: `${__dirname}/views/layouts`,
    defaultLayout: 'index',
    partialsDir: `${__dirname}/views/partials`
}));

app.use(express.static('public'));
app.use(session({keys: ['secretkey1', 'secretkey2', '...']}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(require("./routes/routes"));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000, () => console.log(`Lisetning on http://localhost:3000/`));
