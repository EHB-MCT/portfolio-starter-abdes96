const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/users.js");
const artworksRouter = require("./routes/artworks.js");

require("dotenv").config();

const knexConfig = require("../knexfile.js");
const knex = require("knex")(knexConfig.development);

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.db = knex;
  next();
});

app.use("/users", usersRouter);
app.use("/artworks", artworksRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

module.exports = app;
