const request = require("supertest");

const app = require("../../app")

const knexConfig = require("../../../knexfile");
const dbtest = require("knex")(knexConfig.development);

const USER = {
  name: "test",
  email: "test@email.test",
  password: "test",
};

describe(" User Integration Tests", () => {
  beforeAll(async () => {
    await dbtest("users").insert(USER);
  });

  afterAll(async () => {
    await dbtest("users").where(USER).del();
    await dbtest.destroy();
  });

  test("GET /users should return a list of all users", async () => {
    const response = await request(app).get("/users");
  
    expect(response.status).toBe(200);
  
    console.log(response.body);
  });
  
});
