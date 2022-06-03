//Require Helpers
const { loginAsStudent1 } = require('../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-student-1 /api/v1', function () {
  beforeEach(loginAsStudent1)
  shared.shouldReturnApiVersion()
  shared.shouldReturnAdminRole(0)
  shared.shouldReturnUserId(2)
})
