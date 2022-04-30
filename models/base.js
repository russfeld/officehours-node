const db = require('../configs/db.js')
const Model = require('objection').Model
Model.knex(db)

class BaseModel extends Model {
  $beforeInsert() {
    this.created_at = new Date().toISOString()
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString()
  }
}

module.exports = BaseModel
