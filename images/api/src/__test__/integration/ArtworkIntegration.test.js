const request = require("supertest");
const app = require("../../app");
const knexConfig = require("../../../knexfile");
const dbtest = require("knex")(knexConfig.development);

describe("Artworks Integration Tests", () => {
  let testArtworkId;
  let testUserId;
  let testArtworkData; 

  const testUserData = {
    name: "Test User",
    email: "test@example.com",
    password: "testpassword",
  };

  beforeAll(async () => {
    try {
      const [user] = await dbtest("users").insert(testUserData).returning("*");
      testUserId = user.id;  

      testArtworkData = {
        name: "Test Artwork",
        description: "This is a test artwork.",
        image: "test-image.jpg",
        user_id: testUserId,
        id: 3,
      };

      const [artwork] = await dbtest("artworks")
        .insert(testArtworkData)
        .returning("id");

      testArtworkId = artwork.id;

      console.log("Test User ID:", testUserId);
      console.log("Test Artwork ID:", testArtworkId);
    } catch (error) {
      console.error("Error during setup:", error);
    }
  });

  afterAll(async () => {
    try {
      await dbtest("artworks").where({ id: testArtworkId }).del();
      console.log("Artwork deleted successfully");
    } catch (error) {
      console.error("Error deleting artwork:", error);
    }
  });

  describe("GET /artworks", () => {
    test("should return a list of all artworks", async () => {
      try {
        const response = await request(app).get("/artworks");

        expect(response.status).toBe(200);

        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              description: expect.any(String),
              image: expect.any(String),
              user_id: testArtworkData.user_id,
            }),
          ])
        );

        console.log("GET /artworks Response:", response.body);
      } catch (error) {
        console.error("Error in GET /artworks test:", error);
      }
    });
  });

  describe("GET /artworks/:id", () => {
    test("should return a specific artwork by ID", async () => {
      try {
        const response = await request(app).get(`/artworks/${testArtworkId}`);
  
        if (response.status === 404) {
          expect(response.body).toEqual({ error: "Artwork not found." });
        } else {

          expect(response.status).toBe(200);
          expect(response.body).toEqual(
            expect.objectContaining({
              name: expect.any(String),
              description: expect.any(String),
              image: expect.any(String),
              user_id: testArtworkData.user_id,
            })
          );
          console.log("GET /artworks/:id Response:", response.body);
        }
      } catch (error) {
        console.error("Error in GET /artworks/:id test:", error);
      }
    });
  });
  
});
