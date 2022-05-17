/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
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
      created_at: '2022-01-01T00:00:00',
      updated_at: '2022-01-01T00:00:00',
    },
    {
      id: 2,
      eid: 'test-student-1',
      name: 'Test Student 1',
      contact_info: null,
      image: null,
      created_at: '2022-01-01T00:00:00',
      updated_at: '2022-01-01T00:00:00',
    },
    {
      id: 3,
      eid: 'test-student-2',
      name: 'Test Student 2',
      contact_info: null,
      image: null,
      created_at: '2022-01-01T00:00:00',
      updated_at: '2022-01-01T00:00:00',
    },
    {
      id: 4,
      eid: 'test-student-3',
      name: 'Test Student 3',
      contact_info: null,
      image: null,
      created_at: '2022-01-01T00:00:00',
      updated_at: '2022-01-01T00:00:00',
    },
  ])

  // Roles
  await knex('roles').del()
  await knex('roles').insert([
    {
      id: 1,
      name: 'admin',
      created_at: '2022-01-01T00:00:00',
      updated_at: '2022-01-01T00:00:00',
    },
  ])

  // User Roles
  await knex('user_roles').del()
  await knex('user_roles').insert([
    {
      user_id: '1',
      role_id: '1',
      created_at: '2022-01-01T00:00:00',
      updated_at: '2022-01-01T00:00:00',
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
      created_at: '2022-01-01T00:00:00',
      updated_at: '2022-01-01T00:00:00',
    },
    {
      id: 2,
      name: 'Queue 2',
      snippet:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a viverra nulla. Quisque sed aliquam neque. Curabitur at bibendum quam. Phasellus sit amet nibh ante. In tristique risus at iaculis accumsan.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a viverra nulla. Quisque sed aliquam neque. Curabitur at bibendum quam. Phasellus sit amet nibh ante. In tristique risus at iaculis accumsan. Aenean sed ornare neque. Duis eget mi vitae eros porttitor vehicula nec eu erat. Proin convallis molestie orci eu interdum. In luctus tincidunt elit sit amet condimentum. Nunc quis velit lorem. Morbi eleifend tempus auctor. Sed posuere elementum dui a semper. Quisque non risus at libero porttitor venenatis aliquam ut ante. Nunc mauris dolor, mattis id diam nec, euismod efficitur mauris.',
      created_at: '2022-01-01T00:00:00',
      updated_at: '2022-01-01T00:00:00',
    },
    {
      id: 3,
      name: 'Queue 3',
      snippet:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a viverra nulla. Quisque sed aliquam neque. Curabitur at bibendum quam. Phasellus sit amet nibh ante. In tristique risus at iaculis accumsan.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a viverra nulla. Quisque sed aliquam neque. Curabitur at bibendum quam. Phasellus sit amet nibh ante. In tristique risus at iaculis accumsan. Aenean sed ornare neque. Duis eget mi vitae eros porttitor vehicula nec eu erat. Proin convallis molestie orci eu interdum. In luctus tincidunt elit sit amet condimentum. Nunc quis velit lorem. Morbi eleifend tempus auctor. Sed posuere elementum dui a semper. Quisque non risus at libero porttitor venenatis aliquam ut ante. Nunc mauris dolor, mattis id diam nec, euismod efficitur mauris.',
      created_at: '2022-01-01T00:00:00',
      updated_at: '2022-01-01T00:00:00',
    },
  ])

  // User Queues
  await knex('user_queues').del()
  await knex('user_queues').insert([
    {
      user_id: '2',
      queue_id: '1',
      created_at: '2022-01-01T00:00:00',
      updated_at: '2022-01-01T00:00:00',
    },
    {
      user_id: '3',
      queue_id: '2',
      created_at: '2022-01-01T00:00:00',
      updated_at: '2022-01-01T00:00:00',
    },
    {
      user_id: '4',
      queue_id: '3',
      created_at: '2022-01-01T00:00:00',
      updated_at: '2022-01-01T00:00:00',
    },
  ])

  // Statuses
  await knex('statuses').del()
  await knex('statuses').insert([
    {
      id: '1',
      name: 'New',
      icon: null,
    },
    {
      id: '2',
      name: 'Queued',
      icon: null,
    },
    {
      id: '3',
      name: 'Ready',
      icon: null,
    },
    {
      id: '4',
      name: 'Delay',
      icon: null,
    },
    {
      id: '5',
      name: 'Absent',
      icon: null,
    },
    {
      id: '6',
      name: 'Done',
      icon: null,
    },
  ])
}
