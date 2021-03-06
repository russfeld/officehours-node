/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id')
      table.string('eid', 20).unique().notNullable()
      table.string('name', 255).notNullable()
      table.text('contact_info')
      table.string('image', 255)
      table.string('refresh_token', 255)
      table.timestamps()
    })
    .createTable('roles', function (table) {
      table.increments('id')
      table.string('name', 255).unique().notNullable()
      table.timestamps()
    })
    .createTable('user_roles', function (table) {
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')
      table.primary(['user_id', 'role_id'])
      table.timestamps()
    })
    .createTable('queues', function (table) {
      table.increments('id')
      table.string('name', 255).unique().notNullable()
      table.text('snippet')
      table.text('description')
      table.boolean('is_open')
      table.timestamps()
    })
    .createTable('user_queues', function (table) {
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('queue_id')
        .unsigned()
        .references('id')
        .inTable('queues')
        .onDelete('CASCADE')
      table.primary(['user_id', 'queue_id'])
      table.timestamps()
    })
    .createTable('statuses', function (table) {
      table.increments('id')
      table.string('name', 255).unique().notNullable()
      table.string('icon', 255)
    })
    .createTable('requests', function (table) {
      table.increments('id')
      table
        .integer('queue_id')
        .unsigned()
        .references('id')
        .inTable('queues')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('helper_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('status_id')
        .unsigned()
        .references('id')
        .inTable('statuses')
        .onDelete('CASCADE')
      table.timestamps()
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable('requests')
    .dropTable('statuses')
    .dropTable('user_queues')
    .dropTable('queues')
    .dropTable('user_roles')
    .dropTable('roles')
    .dropTable('users')
}
