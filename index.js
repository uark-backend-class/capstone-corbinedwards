require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());
app.use(require("./routes/routes"));

app.listen(3000, () => console.log(`Lisetning on http://localhost:3000/`));
