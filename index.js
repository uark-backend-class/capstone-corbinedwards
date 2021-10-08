require("dotenv").config();

const express = require("express");
const app = express();

const handlebars = require("express-handlebars");

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({
    layoutsDir: `${__dirname}/views/layouts`,
    defaultLayout: 'index',
    partialsDir: `${__dirname}/views/partials`
}));

app.use(express.static('public'));
app.use(express.json());
app.use(require("./routes/routes"));

app.listen(3000, () => console.log(`Lisetning on http://localhost:3000/`));
