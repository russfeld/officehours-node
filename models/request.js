const Model = require('./base')

class Request extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'request'
  }

  // Each model must have a column (or a set of columns) that uniquely
  // identifies the rows. The column(s) can be specified using the `idColumn`
  // property. `idColumn` returns `id` by default and doesn't need to be
  // specified unless the model's primary key is something else.
  static get idColumn() {
    return 'id'
  }

  // Methods can be defined for model classes just as you would for
  // any JavaScript class. If you want to include the result of these
  // methods in the output json, see `virtualAttributes`.
  //fullName() {
  //  return this.firstName + ' ' + this.lastName;
  //}

  // Optional JSON schema. This is not the database schema!
  // No tables or columns are generated based on this. This is only
  // used for input validation. Whenever a model instance is created
  // either explicitly or implicitly it is checked against this schema.
  // See http://json-schema.org/ for more info.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['queue_id, user_id, status_id'],
    }
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    // Importing models here is one way to avoid require loops.
    const User = require('./user')
    const Queue = require('./queue')
    const Status = require('./status')

    return {
      queue: {
        relation: Model.BelongsToOneRelation,
        modelClass: Queue,
        join: {
          from: 'requests.queue_id',
          to: 'queues.id',
        },
      },

      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'requests.user_id',
          to: 'users.id',
        },
      },

      helper: {
        relation: Model.BelongsToOneRelation,
        modelClass: Queue,
        join: {
          from: 'requests.helper_id',
          to: 'users.id',
        },
      },

      status: {
        relation: Model.BelongsToOneRelation,
        modelClass: Status,
        join: {
          from: 'requests.status_id',
          to: 'statuses.id',
        },
      },
    }
  }
}

module.exports = Request
