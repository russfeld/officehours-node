/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  var then = new Date(now)
  then.setMinutes(then.getMinutes() - 5)

  // Users
  await knex('users').del()
  await knex('users').insert([
    {
      id: 1,
      eid: 'test-admin',
      name: 'Test Administrator',
      contact_info:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a viverra nulla. Quisque sed aliquam neque. Curabitur at bibendum quam. Phasellus sit amet nibh ante. In tristique risus at iaculis accumsan. Aenean sed ornare neque. Duis eget mi vitae eros porttitor vehicula nec eu erat. Proin convallis molestie orci eu interdum. In luctus tincidunt elit sit amet condimentum. Nunc quis velit lorem. Morbi eleifend tempus auctor. Sed posuere elementum dui a semper. Quisque non risus at libero porttitor venenatis aliquam ut ante. Nunc mauris dolor, mattis id diam nec, euismod efficitur mauris.',
      image: 'https://dummyimage.com/300',
      created_at: now,
      updated_at: now,
    },
    {
      id: 2,
      eid: 'test-student-1',
      name: 'Test Student 1',
      contact_info: null,
      image: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 3,
      eid: 'test-student-2',
      name: 'Test Student 2',
      contact_info: null,
      image: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 4,
      eid: 'test-student-3',
      name: 'Test Student 3',
      contact_info: null,
      image: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 5,
      eid: 'test-student-4',
      name: 'Test Student 4',
      contact_info: null,
      image: null,
      created_at: now,
      updated_at: now,
    },
  ])

  // Roles
  await knex('roles').del()
  await knex('roles').insert([
    {
      id: 1,
      name: 'admin',
      created_at: now,
      updated_at: now,
    },
  ])

  // User Roles
  await knex('user_roles').del()
  await knex('user_roles').insert([
    {
      user_id: '1',
      role_id: '1',
      created_at: now,
      updated_at: now,
    },
  ])

  // Queues
  await knex('queues').del()
  await knex('queues').insert([
    {
      id: 1,
      name: 'Queue 1',
      snippet:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a viverra nulla. Quisque sed aliquam neque. Curabitur at bibendum quam. Phasellus sit amet nibh ante. In tristique risus at iaculis accumsan.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a viverra nulla. Quisque sed aliquam neque. Curabitur at bibendum quam. Phasellus sit amet nibh ante. In tristique risus at iaculis accumsan. Aenean sed ornare neque. Duis eget mi vitae eros porttitor vehicula nec eu erat. Proin convallis molestie orci eu interdum. In luctus tincidunt elit sit amet condimentum. Nunc quis velit lorem. Morbi eleifend tempus auctor. Sed posuere elementum dui a semper. Quisque non risus at libero porttitor venenatis aliquam ut ante. Nunc mauris dolor, mattis id diam nec, euismod efficitur mauris.',
      is_open: 0,
      created_at: now,
      updated_at: now,
    },
    {
      id: 2,
      name: 'Queue 2',
      snippet:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a viverra nulla. Quisque sed aliquam neque. Curabitur at bibendum quam. Phasellus sit amet nibh ante. In tristique risus at iaculis accumsan.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a viverra nulla. Quisque sed aliquam neque. Curabitur at bibendum quam. Phasellus sit amet nibh ante. In tristique risus at iaculis accumsan. Aenean sed ornare neque. Duis eget mi vitae eros porttitor vehicula nec eu erat. Proin convallis molestie orci eu interdum. In luctus tincidunt elit sit amet condimentum. Nunc quis velit lorem. Morbi eleifend tempus auctor. Sed posuere elementum dui a semper. Quisque non risus at libero porttitor venenatis aliquam ut ante. Nunc mauris dolor, mattis id diam nec, euismod efficitur mauris.',
      is_open: 0,
      created_at: now,
      updated_at: now,
    },
    {
      id: 3,
      name: 'Queue 3',
      snippet:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a viverra nulla. Quisque sed aliquam neque. Curabitur at bibendum quam. Phasellus sit amet nibh ante. In tristique risus at iaculis accumsan.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a viverra nulla. Quisque sed aliquam neque. Curabitur at bibendum quam. Phasellus sit amet nibh ante. In tristique risus at iaculis accumsan. Aenean sed ornare neque. Duis eget mi vitae eros porttitor vehicula nec eu erat. Proin convallis molestie orci eu interdum. In luctus tincidunt elit sit amet condimentum. Nunc quis velit lorem. Morbi eleifend tempus auctor. Sed posuere elementum dui a semper. Quisque non risus at libero porttitor venenatis aliquam ut ante. Nunc mauris dolor, mattis id diam nec, euismod efficitur mauris.',
      is_open: 1,
      period_id: 1,
      created_at: now,
      updated_at: now,
    },
  ])

  // User Queues
  await knex('user_queues').del()
  await knex('user_queues').insert([
    {
      user_id: '2',
      queue_id: '1',
      created_at: now,
      updated_at: now,
    },
    {
      user_id: '3',
      queue_id: '1',
      created_at: now,
      updated_at: now,
    },
    {
      user_id: '4',
      queue_id: '1',
      created_at: now,
      updated_at: now,
    },
    {
      user_id: '3',
      queue_id: '2',
      created_at: now,
      updated_at: now,
    },
    {
      user_id: '4',
      queue_id: '2',
      created_at: now,
      updated_at: now,
    },
    {
      user_id: '4',
      queue_id: '3',
      created_at: now,
      updated_at: now,
    },
  ])

  // Requests
  await knex('requests').del()
  await knex('requests').insert([
    {
      id: '1',
      queue_id: '3',
      user_id: '2',
      status_id: '3',
      helper_id: '1',
    },
    {
      id: '2',
      queue_id: '3',
      user_id: '3',
      status_id: '2',
      helper_id: '4',
    },
    {
      id: '3',
      queue_id: '3',
      user_id: '2',
      status_id: '1',
      helper_id: null,
    },
  ])

  // Periods
  await knex('periods').del()
  await knex('periods').insert([
    {
      id: '1',
      queue_name: 'Queue 3',
      is_open: '1',
      created_at: then,
      updated_at: now,
    },
  ])

  // Presences
  await knex('presences').del()
  await knex('presences').insert([
    {
      id: '1',
      eid: 'test-student-3',
      period_id: '1',
      created_at: then,
      updated_at: now,
    },
  ])

  // Events
  await knex('events').del()
  await knex('events').insert([
    {
      id: '1',
      eid: 'test-student-1',
      status: 'Taken',
      presence_id: null,
      period_id: '1',
      created_at: then,
      updated_at: now,
    },
  ])
}
