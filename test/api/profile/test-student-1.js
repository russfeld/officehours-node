//Require Helpers
const { loginAsStudent1 } = require('../../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-student-1 /api/v1/queues', function () {
  beforeEach(loginAsStudent1)

  const user = {
    id: 2,
    eid: 'test-student-1',
    name: 'Test Student 1',
  }

  const newUser = {
    eid: 'changed-eid',
    name: 'New Name',
    contact_info: 'New Contact Info',
  }

  shared.shouldReturnProfile(user)
  shared.shouldUpdateProfile(user, newUser)
})
