//Require Helpers
const { loginAsStudent3 } = require('../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-student-3 /api/v1', function () {
  beforeEach(loginAsStudent3)
  shared.shouldReturnApiVersion()
  shared.shouldReturnAdminRole(0)
  shared.shouldReturnUserId(4)
})
