/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require("dotenv").config();
module.exports = {
  development: {
    client: "postgresql",
    connection: process.env.PG_CONNECTION_STRING,

    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
