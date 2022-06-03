//Require Helpers
const { loginAsStudent2 } = require('../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-student-2 /api/v1', function () {
  beforeEach(loginAsStudent2)
  shared.shouldReturnApiVersion()
  shared.shouldReturnAdminRole(0)
  shared.shouldReturnUserId(3)
})
