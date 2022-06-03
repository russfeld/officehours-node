//Require Helpers
const { loginAsAdmin } = require('../../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-admin /api/v1/profile', function () {
  beforeEach(loginAsAdmin)

  const user = {
    id: 1,
    eid: 'test-admin',
    name: 'Test Administrator',
  }

  const newUser = {
    eid: 'changed-eid',
    name: 'New Name',
    contact_info: 'New Contact Info',
  }

  shared.shouldReturnProfile(user)
  shared.shouldUpdateProfile(user, newUser)
})
