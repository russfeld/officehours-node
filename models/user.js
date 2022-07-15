const Model = require('./base')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const logger = require('../configs/logger')

class User extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'users'
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
  static async findOrCreate(eid) {
    let user = await User.query().where('eid', eid).limit(1)
    // user not found - create user
    if (user.length === 0) {
      user = [
        await User.query().insert({
          eid: eid,
          name: eid,
        }),
      ]
      logger.info('User ' + eid + ' created')
    }
    return user[0]
  }

  static async findByRefreshToken(token) {
    let user = await User.query().where('refresh_token', token).limit(1)
    if (user.length === 0) {
      return null
    }
    return user[0]
  }

  async updateRefreshToken() {
    var token = this.refresh_token
    if (!token) {
      token = crypto.randomBytes(32).toString('hex')
      await this.$query().patch({
        refresh_token: token,
      })
    }
    const refresh_token = jwt.sign(
      {
        refresh_token: token,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '6h',
      }
    )
    return refresh_token
  }

  async is_admin() {
    const roles = await this.$relatedQuery('roles').for(this.id).select('name')
    //Roles for current user
    //console.log(roles)
    return roles.some((r) => r.name === 'admin')
  }

  static async getToken(id) {
    //const refresh_token = await User.updateRefreshToken(id)
    let user = await User.query().findById(id)
    const refresh_token = await user.updateRefreshToken()
    const is_admin = await user.is_admin()
    const token = jwt.sign(
      {
        user_id: id,
        eid: user.eid,
        is_admin: is_admin,
        refresh_token: refresh_token,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '30m',
      }
    )
    return token
  }

  static async clearRefreshToken(id) {
    await User.query().findById(id).patch({
      refresh_token: null,
    })
  }

  // Optional JSON schema. This is not the database schema!
  // No tables or columns are generated based on this. This is only
  // used for input validation. Whenever a model instance is created
  // either explicitly or implicitly it is checked against this schema.
  // See http://json-schema.org/ for more info.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['eid', 'name'],

      properties: {
        eid: { type: 'string', minLength: 3, maxLength: 20 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
      },
    }
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    // Importing models here is one way to avoid require loops.
    const Role = require('./role')
    const Queue = require('./queue')
    const Request = require('./request')

    return {
      requests: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: Request,
        join: {
          from: 'users.id',
          to: 'requests.user_id',
        },
      },

      helps: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: Request,
        join: {
          from: 'users.id',
          to: 'requests.helper_id',
        },
      },

      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'users.id',
          // ManyToMany relation needs the `through` object
          // to describe the join table.
          through: {
            // If you have a model class for the join table
            // you need to specify it like this:
            // modelClass: PersonMovie,
            from: 'user_roles.user_id',
            to: 'user_roles.role_id',
          },
          to: 'roles.id',
        },
      },

      queues: {
        relation: Model.ManyToManyRelation,
        modelClass: Queue,
        join: {
          from: 'users.id',
          // ManyToMany relation needs the `through` object
          // to describe the join table.
          through: {
            // If you have a model class for the join table
            // you need to specify it like this:
            // modelClass: PersonMovie,
            from: 'user_queues.user_id',
            to: 'user_queues.queue_id',
          },
          to: 'queues.id',
        },
      },
    }
  }
}

module.exports = User
