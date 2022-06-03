process.env.NODE_ENV = 'test'
process.env.FORCE_AUTH = 'true'

//Require app dependencies
require('../app')
let db = require('../configs/db')

// Root Hook Runs Before Each Test
exports.mochaHooks = {
  beforeEach(done) {
    // Seed the database
    db.seed.run().then(function () {
      done()
    })
  },
}
