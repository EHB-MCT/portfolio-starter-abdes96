const request = require("supertest");
const app = require("../../app")
const knexConfig = require("../../../knexfile");
const dbtest = require("knex")(knexConfig.development);


describe("User Registration Integration Tests", () => {
  afterAll(async () => {
    await dbtest("users").del();
    await dbtest.destroy();
  });

  test("Registers a new user successfully", async () => {
    const userData = {
      id : 2,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty(
      "message",
      "User created successfully"
    );
    expect(response.body).toHaveProperty("userId");
  });

 test("Returns 400 for short password", async () => {
  const userData = {
    name: "John Doe",
    email: "john@example.com",
    password: "pass", // Short password
  };

  const response = await request(app)
    .post("/users/register")
    .send(userData)
    .expect(400);

  console.log(response.body);
  expect(response.body.message).toBe(
    "Password must be at least 5 characters long and contain at least one numeric digit."
  );
});

test("Returns 400 for duplicate email", async () => {
    const userData = {
      name: "Jane Doe",
      email: "john@example.com",
      password: "password456",
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData)
      .expect(400);

    console.log(response.body);
    expect(response.body.error).toBe(
      "Email is already in use. Please choose a different email."
    );
  });
  
});
