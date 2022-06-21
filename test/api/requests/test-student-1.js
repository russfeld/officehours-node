//Require Helpers
const { loginAsStudent1 } = require('../../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-student-1 /api/v1/requests', function () {
  beforeEach(loginAsStudent1)

  shared.shouldReturnRequestsForQueue(1)
  shared.shouldReturnRequestsForQueue(2)
  shared.shouldReturnRequestsForQueue(3)

  it('there should be more tests here!')
})
