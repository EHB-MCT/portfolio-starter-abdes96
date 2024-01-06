const express = require("express");
const router = express.Router();
const Artwork = require("../classes/Artwork.js");

const validateArtworkInputs = (inputs) => {
  const { name, description, image, user_id } = inputs;

  if (!name || !description || !image || !user_id) {
    throw new Error("Name, description, image, and user ID are required.");
  }

  if (!Number.isInteger(user_id) || user_id <= 0) {
    throw new Error("Invalid user ID. Must be a positive integer.");
  }
};

/**
 * @route POST /artworks
 * @desc Create a new artwork.
 * @body {string} name - The name of the artwork.
 * @body {string} description - The description of the artwork.
 * @body {string} image - The image URL of the artwork.
 * @body {number} user_id - The ID of the user associated with the artwork.
 * @returns {Object} An object indicating the success of the artwork creation.
 * @throws {Error} If there is an error in creating the artwork.
 */
router.post("/", async (req, res) => {
  try {
    const { name, description, image, user_id } = req.body;

    validateArtworkInputs({ name, description, image, user_id });

    const newArtwork = new Artwork({ name, description, image, user_id });

    const artworkId = await newArtwork.save();

    res
      .status(201)
      .json({ message: "Artwork created successfully", artworkId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route GET /artworks
 * @desc Get all artworks.
 * @returns {Array} An array containing all artworks.
 * @throws {Error} If there is an error in retrieving artworks.
 */
router.get("/", async (req, res) => {
  try {
    const artworks = await req.db("artworks").select("*");

    res.json(artworks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route GET /artworks/:id
 * @desc Get a specific artwork by ID.
 * @param {number} id - The ID of the artwork.
 * @returns {Object} The artwork object.
 * @throws {Error} If there is an error in retrieving the artwork.
 */
router.get("/:id", async (req, res) => {
  try {
    const artworkId = req.params.id;

    // Retrieve the  from the database by ID
    const artwork = await req.db("artworks").where("id", artworkId).first();

    if (!artwork) {
      return res.status(404).json({ error: "Artwork not found." });
    }

    res.json(artwork);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route GET /artworks/user/:userId
 * @desc Get artworks of a specific user.
 * @param {number} userId - The ID of the user.
 * @returns {Array} An array containing artworks of the specified user.
 * @throws {Error} If there is an error in retrieving artworks.
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const artworks = await req.db("artworks").where("user_id", userId);

    if (artworks.length === 0) {
      return res
        .status(404)
        .json({ message: "No artworks found for the specified user." });
    }

    res.json(artworks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route PUT /artworks/:id
 * @desc Update a specific artwork by ID.
 * @param {number} id - The ID of the artwork.
 * @body {string} name - The new name of the artwork.
 * @body {string} description - The new description of the artwork.
 * @body {string} image - The new image URL of the artwork.
 * @body {number} user_id - The new user ID associated with the artwork.
 * @returns {Object} An object indicating the success of the artwork update.
 * @throws {Error} If there is an error in updating the artwork.
 */

router.put("/:id", async (req, res) => {
  try {
    const artworkId = req.params.id;
    const { name, description, image, user_id } = req.body;

    validateArtworkInputs({ name, description, image, user_id });

    const existingArtwork = await req
      .db("artworks")
      .where("id", artworkId)
      .first();

    if (!existingArtwork) {
      return res.status(404).json({ error: "Artwork not found." });
    }

    if (user_id !== existingArtwork.user_id) {
      return res
        .status(403)
        .json({
          error:
            "Permission denied. You can only update artworks that belong to you.",
        });
    }

    existingArtwork.name = name;
    existingArtwork.description = description;
    existingArtwork.image = image;

    await req.db("artworks").where("id", artworkId).update(existingArtwork);

    res.json({ message: "Artwork updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route DELETE /artworks/:id
 * @desc Delete a specific artwork by ID.
 * @param {number} id - The ID of the artwork.
 * @returns {Object} An object indicating the success of the artwork deletion.
 * @throws {Error} If there is an error in deleting the artwork.
 */

router.delete("/:id", async (req, res) => {
  try {
    const artworkId = req.params.id;
    const requestedUserId = req.body.user_id;

    const existingArtwork = await req
      .db("artworks")
      .where("id", artworkId)
      .first();

    if (!existingArtwork) {
      return res.status(404).json({ error: "Artwork not found." });
    }

    if (existingArtwork.user_id !== requestedUserId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this artwork." });
    }

    await req.db("artworks").where("id", artworkId).del();

    res.json({ message: "Artwork deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
