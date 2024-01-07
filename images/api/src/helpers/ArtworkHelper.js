// Artworkhelper.js

/**
 * Validates the inputs for creating a new artwork.
 *
 * @param {Object} inputs - The inputs for creating a new artwork.
 * @param {string} inputs.name - The name of the artwork.
 * @param {string} inputs.description - The description of the artwork.
 * @param {string} inputs.image - The image URL of the artwork.
 * @param {number} inputs.user_id - The ID of the user associated with the artwork.
 * @throws {Error} If validation fails.
 */

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
 * Validates the update operation for a specific artwork.
 *
 * @param {number} artworkId - The ID of the artwork.
 * @param {number} requestedUserId - The ID of the user making the request.
 * @param {Object} db - The database connection object.
 * @returns {Object} The existing artwork if validation passes.
 * @throws {Error} If validation fails.
 */

const validateArtworkUpdate = async (artworkId, requestedUserId, db) => {
  const existingArtwork = await db("artworks").where("id", artworkId).first();

  if (!existingArtwork) {
    throw new Error("Artwork not found.");
  }

  if (existingArtwork.user_id !== requestedUserId) {
    throw new Error(
      "Permission denied. You can only update artworks that belong to you."
    );
  }

  return existingArtwork;
};

/**
 * Validates the deletion operation for a specific artwork.
 *
 * @param {number} artworkId - The ID of the artwork.
 * @param {number} requestedUserId - The ID of the user making the request.
 * @param {Object} db - The database connection object.
 * @throws {Error} If validation fails.
 */

const validateArtworkDeletion = async (artworkId, requestedUserId, db) => {
  const existingArtwork = await db("artworks").where("id", artworkId).first();

  if (!existingArtwork) {
    throw new Error("Artwork not found.");
  }

  if (existingArtwork.user_id !== requestedUserId) {
    throw new Error("You do not have permission to delete this artwork.");
  }
};

/**
 * Checks if a user with a given ID exists in the database.
 *
 * @param {Object} db - The database connection object.
 * @param {number} userId - The ID of the user to check.
 * @returns {boolean} True if the user exists, false otherwise.
 * @throws {Error} If there is an error checking for user existence.
 */

async function userExists(db, userId) {
  try {
    const user = await db("users").where({ id: userId }).first();
    return !!user;
  } catch (error) {
    console.error(error);
    throw new Error("Error checking if user exists.");
  }
}

module.exports = {
  validateArtworkInputs,
  validateArtworkUpdate,
  validateArtworkDeletion,
  userExists,
};
