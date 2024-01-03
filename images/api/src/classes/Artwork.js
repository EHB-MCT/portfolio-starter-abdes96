// artwork class
const knexConfig = require("../knexfile");
const db = require("knex")(knexConfig.development);

class Artwork {
    constructor({ name, description, image, user_id }) {
      this.name = name;
      this.description = description;
      this.image = image;
      this.user_id = user_id;
    }

    async save() {
      try {
        const [artworkId] = await db('artworks').insert({
          name: this.name,
          description: this.description,
          image: this.image,
          user_id: this.user_id,
        }).returning('name');
  
        return artworkId;
      } catch (error) {
        throw error;
      }
    }
  }

  
  
  module.exports = Artwork;
  