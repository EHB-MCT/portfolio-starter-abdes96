
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require('dotenv').config({path: '../.env'});

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: process.env.POSTGRES_DB, 
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

};




/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require("dotenv").config();
module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
