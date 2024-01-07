exports.seed = async function (knex) {
  await knex("artworks").del();
  await knex("users").del();

  const [user] = await knex("users").insert({
    name: "test",
    email: "test@example.com",
    password: "test123",
  }).returning("*");

  const artworks = [
    {
      name: "Test Artwork 1",
      description: "This is a test artwork.",
      image: "https://cdna.artstation.com/p/assets/images/images/071/171/034/large/darya-fefelova-shot-1.jpg?1704619275",
      user_id: user.id,
    },
    {
      name: "Test Artwork 2",
      description: "Another test artwork.",
      image: "https://cdna.artstation.com/p/assets/images/images/070/748/154/large/amelia-gabaldon-digital-coalition-01.jpg?1703361083",
      user_id: user.id,
    },
    {
      name: "Test Artwork 3",
      description: "Yet another test artwork.",
      image: "https://cdnb.artstation.com/p/assets/images/images/071/159/695/large/daria-dudkina-sonnikotyan-select-a-file-name-for-output-files-005.jpg?1704580098",
      user_id: user.id,
    },
    {
      name: "Test Artwork 4",
      description: "One more test artwork.",
      image: "https://cdnb.artstation.com/p/assets/images/images/071/113/909/4k/romell-chopraa-ferenbulls-batman-gotham-by-gaslight-dc-comics-gallery-6500e44c46ff3.jpg?1704469229",
      user_id: user.id,
    },
  ];

  await knex("artworks").insert(artworks);

  return Promise.resolve();
};
