//Require Shared Tests
const shared = require('./shared')

describe('test-student-1 /auth', function () {
  const user = {
    id: 2,
    eid: 'test-student-1',
    is_admin: false,
  }

  shared.shouldAllowLogin(user.eid)
  shared.tokenShouldIncludeUserData(user)
  shared.shouldAllowUserToRefreshToken(user.eid)
})
