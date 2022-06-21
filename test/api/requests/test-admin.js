//Require Helpers
const { loginAsAdmin } = require('../../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-admin /api/v1/requests', function () {
  beforeEach(loginAsAdmin)

  shared.shouldReturnRequestsForQueue(1)
  shared.shouldReturnRequestsForQueue(2)
  shared.shouldReturnRequestsForQueue(3)
})
