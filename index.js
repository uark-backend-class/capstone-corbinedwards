require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("cookie-session");
const Handlebars = require('handlebars');
const expressHandlebars = require("express-handlebars");
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");

const User = require("./models/user");

mongoose.connect(process.env.MONGO_CONNECT);

app.set('view engine', 'hbs');
app.engine('hbs', expressHandlebars({
    layoutsDir: `${__dirname}/views/layouts`,
    extname: '.hbs',
    defaultLayout: 'index',
    partialsDir: `${__dirname}/views/partials`,
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        authenticated: function() {
            return app.locals.authenicated;
        },
        toString: function(prop) {
            return "id-" + prop.toString();
        },
        toId: function(prop) {
            return "#id-" + prop.toString();
        },
        commaList: function(input) {
            let list = "";
            if(input.length > 0) list = input.join(', ');
            return list;
        },
        listSteps: function(steps) {
            let stepsBlock = "";

            for(step of steps) {
                let stepIngredients = step.ingredients.map(i => ' ' + i.name).toString();
                // stepIngredients = stepIngredients.toString().trim();
                // stepIngredients = stepIngredients.replace(/.$/, '');

                stepsBlock += '<div>'
                stepsBlock += `<h5>Step ${step.number}</h5>`
                stepsBlock += `<p><strong>Ingredients: </strong>${stepIngredients}</p>`
                stepsBlock += `<p>${step.instructions}</p>`
                stepsBlock += '</div>\n'
            }

            return stepsBlock;
        }
    }
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({keys: ['secretkey1', 'secretkey2', '...']}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(require("./routes/routes"));

app.locals.authenticated = false;

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000, () => console.log(`Listening on http://localhost:3000/`));
