const Model = require('./base')

class Event extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'events'
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
      required: ['eid', 'status', 'period_id'],
    }
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    // Importing models here is one way to avoid require loops.
    const Presence = require('./presence')
    const Period = require('./period')

    return {
      presence: {
        relation: Model.BelongsToOneRelation,
        modelClass: Presence,
        join: {
          from: 'events.presence_id',
          to: 'presences.id',
        },
      },

      period: {
        relation: Model.BelongsToOneRelation,
        modelClass: Period,
        join: {
          from: 'events.period_id',
          to: 'periods.id',
        },
      },
    }
  }
}

module.exports = Event
