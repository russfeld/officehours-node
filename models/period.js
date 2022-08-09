const Model = require('./base')

class Period extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'periods'
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
      required: ['queue_name', 'is_open'],
    }
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    // Importing models here is one way to avoid require loops.
    const Event = require('./event')
    const Presence = require('./presence')

    return {
      events: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: Event,
        join: {
          from: 'periods.id',
          to: 'events.period_id',
        },
      },

      presences: {
        relation: Model.HasManyRelation,
        modelClass: Presence,
        join: {
          from: 'periods.id',
          to: 'presences.period_id',
        },
      },
    }
  }
}

module.exports = Period
