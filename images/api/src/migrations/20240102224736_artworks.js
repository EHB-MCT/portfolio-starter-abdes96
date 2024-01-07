/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
    return knex.schema.createTable('artworks', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('description');
        table.string('image');
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE'); 
    })
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('artworks');
};