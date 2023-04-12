/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username", 255).notNullable().unique();
      table.string("email", 255).notNullable().unique();
      table.string("password", 255).notNullable();
    })
    .createTable("games_library", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.integer("game_id").unsigned().notNullable();
      table.foreign("user_id").references("users.id");
      table.unique(["user_id", "game_id"]);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("games_library")
    .dropTableIfExists("users");
};
