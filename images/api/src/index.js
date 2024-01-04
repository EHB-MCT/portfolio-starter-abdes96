const express = require("express");
const app = express();
const port = 3000;
const knex = require("knex")(require("./knexfile.js").development);

app.get("/", (req, res) => {
  knex
    .select("*")
    .from("users")
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send("An error occurred"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
