const {
  validateArtworkInputs,
  validateArtworkUpdate,
  validateArtworkDeletion,
  userExists,
} = require("../../helpers/ArtworkHelper.js");

const knexConfig = require("../../../knexfile");
const dbtest = require("knex")(knexConfig.development);


describe("ArtworkHelper", () => {

  

  describe("validateArtworkInputs", () => {
    test("should throw an error for missing inputs", () => {
      const invalidInputs = {
        description: "Test description",
        image: "test.jpg",
        user_id: 1,
      };
      expect(() => validateArtworkInputs(invalidInputs)).toThrow(
        "Name, description, image, and user ID are required."
      );
    });

    test("should throw an error for an invalid user_id", () => {
      const invalidInputs = {
        name: "Test Artwork",
        description: "Test description",
        image: "test.jpg",
        user_id: "invalid",
      };
      expect(() => validateArtworkInputs(invalidInputs)).toThrow(
        "Invalid user ID. Must be a positive integer."
      );
    });

    test("should not throw an error for valid inputs", () => {
      const validInputs = {
        name: "Test Artwork",
        description: "Test description",
        image: "test.jpg",
        user_id: 1,
      };
      expect(() => validateArtworkInputs(validInputs)).not.toThrow();
    });
  });


  describe("validateArtworkUpdate", () => {
    test("throws an error for missing inputs", () => {
      const invalidInputs = {
        description: "Test descrifption",
        image: "test.jpg",
        user_id: 1,
      };
      expect(() => validateArtworkInputs(invalidInputs)).toThrow(
        "Name, description, image, and user ID are required."
      );
    });

    test("throws an error for an invalid user_id (not an integer)", () => {
      const invalidInputs = {
        name: "Test Artwork",
        description: "Test description",
        image: "test.jpg",
        user_id: "invalid",
      };
      expect(() => validateArtworkInputs(invalidInputs)).toThrow(
        "Invalid user ID. Must be a positive integer."
      );
    });

    test("throws an error for an invalid user_id (negative value)", () => {
      const invalidInputs = {
        name: "Test Artwork",
        description: "Test description",
        image: "test.jpg",
        user_id: -1,
      };
      expect(() => validateArtworkInputs(invalidInputs)).toThrow(
        "Invalid user ID. Must be a positive integer."
      );
    });

    test("does not throw an error for valid inputs", () => {
      const validInputs = {
        name: "Test Artwork",
        description: "Test description",
        image: "test.jpg",
        user_id: 1,
      };
      expect(() => validateArtworkInputs(validInputs)).not.toThrow();
    });
  });

  
  
  
});
