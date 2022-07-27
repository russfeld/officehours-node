//Require Helpers
const { loginAsAdmin } = require('../../helpers')
const {
  startSocketServer,
  connectAdminSocket,
  closeAdminSocket,
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
