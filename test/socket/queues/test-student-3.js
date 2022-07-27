//Require Helpers
const { loginAsStudent3 } = require('../../helpers')
const {
  startSocketServer,
  connectStudent3Socket,
  closeStudent3Socket,
  stopSocketServer,
} = require('../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-student-3 socket queues', function () {
  beforeEach(loginAsStudent3)
  beforeEach(startSocketServer)
  beforeEach(connectStudent3Socket)

  shared.shouldConnectToQueueSocket('student3')
  shared.shouldOpenQueue('student3')
  shared.shouldCloseQueue('student3')

  afterEach(closeStudent3Socket)
  afterEach(stopSocketServer)
})
