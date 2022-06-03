//Require Helpers
const { loginAsAdmin } = require('../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-admin /api/v1', function () {
  beforeEach(loginAsAdmin)
  shared.shouldReturnApiVersion()
  shared.shouldReturnAdminRole(1)
  shared.shouldReturnUserId(1)
})
