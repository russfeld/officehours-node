//Require Helpers
const { loginAsAdmin, loginAsStudent1 } = require('../../helpers')
const {
  startSocketServer,
  connectAdminSocket,
  connectStudent1Socket,
  closeAdminSocket,
  closeStudent1Socket,
  stopSocketServer,
} = require('../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-admin socket queues', function () {
  beforeEach(loginAsAdmin)
  beforeEach(startSocketServer)
  beforeEach(connectAdminSocket)

  shared.shouldConnectToQueueSocket('admin')
  shared.shouldOpenQueue('admin')
  shared.shouldCloseQueue('admin')

  afterEach(closeAdminSocket)
  afterEach(stopSocketServer)
})

describe('test-admin socket events queues', function () {
  beforeEach(loginAsAdmin)
  beforeEach(loginAsStudent1)
  beforeEach(startSocketServer)
  beforeEach(connectAdminSocket)
  beforeEach(connectStudent1Socket)

  shared.shouldEmitQueueOpeningAfterOpening('admin', 'student1')
  shared.shouldEmitQueueClosingAfterClosing('admin', 'student1')

  afterEach(closeStudent1Socket)
  afterEach(closeAdminSocket)
  afterEach(stopSocketServer)
})
