//Require Helpers
const { loginAsAdmin, loginAsStudent4 } = require('../../helpers')
const {
  startSocketServer,
  connectStudent4Socket,
  closeStudent4Socket,
  stopSocketServer,
  connectAdminSocket,
  closeAdminSocket,
} = require('../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-student-4 socket closed queue', function () {
  beforeEach(loginAsStudent4)
  beforeEach(startSocketServer)
  beforeEach(connectStudent4Socket)

  shared.shouldNotJoinClosedQueue('student4')

  afterEach(closeStudent4Socket)
  afterEach(stopSocketServer)
})

describe('test-student-4 socket open queue', function () {
  beforeEach(loginAsAdmin)
  beforeEach(loginAsStudent4)
  beforeEach(startSocketServer)
  beforeEach(connectAdminSocket)
  beforeEach(connectStudent4Socket)

  shared.shouldJoinOpenQueue('admin', 'student4')
  shared.shouldEmitQueueUpdateAfterJoin('admin', 'student4')

  afterEach(closeAdminSocket)
  afterEach(closeStudent4Socket)
  afterEach(stopSocketServer)
})
