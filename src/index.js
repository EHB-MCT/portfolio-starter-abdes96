const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const knexfile = require("../knexfile");
const db = require("knex")(knexfile.development);
const app = express();

app.use(bodyParser.json());



// Create an artwork
app.post("/artworks", async (req, res) => {
  try {
    const { title, artist_uuid, image_url } = req.body;

    const [artworkId] = await db("artworks").insert({
      title,
      artist_uuid,
      image_url,
    });

    res.status(201).json({ id: artworkId });
  } catch (error) {
    console.error("Error creating artwork:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a car
app.post("/cars", async (req, res) => {
  try {
    const { make, model, year } = req.body;

    const [carId] = await db("cars").insert({
      make,
      model,
      year,
    });

    res.status(201).json({ id: carId });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all cars
app.get("/cars", async (req, res) => {
  try {
    const cars = await db("cars").select();
    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get car by ID
app.get("/cars/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const car = await db("cars").where({ id }).first();
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ error: "Car not found" });
    }
  } catch (error) {
    console.error("Error fetching car by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update car by ID
app.put("/cars/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { make, model, year } = req.body;

    const updatedCount = await db("cars").where({ id }).update({
      make,
      model,
      year,
    });

    if (updatedCount > 0) {
      res.json({ message: "Car updated successfully" });
    } else {
      res.status(404).json({ error: "Car not found" });
    }
  } catch (error) {
    console.error("Error updating car by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete car by ID
app.delete("/cars/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCount = await db("cars").where({ id }).del();
    if (deletedCount > 0) {
      res.json({ message: "Car deleted successfully" });
    } else {
      res.status(404).json({ error: "Car not found" });
    }
  } catch (error) {
    console.error("Error deleting car by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
