// src/seeders/01_combined_seed.js

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("artworks").del();
  await knex("users").del();

  // Seed users
  const [user] = await knex("users").insert({
    name: "test",
    email: "test@example.com",
    password: "test123",
  }).returning("*");

  // Seed artworks
  await knex("artworks").insert({
    name: "Test Artwork",
    description: "This is a test artwork.",
    image: "test-image.jpg",
    user_id: user.id,
  });

  // Seed additional data if needed...

  return Promise.resolve();
};
