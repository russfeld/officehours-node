//Require Helpers
const { loginAsStudent1 } = require('../../helpers')
const {
  startSocketServer,
  connectStudent1Socket,
  closeStudent1Socket,
  stopSocketServer,
} = require('../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-student-1 socket queues', function () {
  beforeEach(loginAsStudent1)
  beforeEach(startSocketServer)
  beforeEach(connectStudent1Socket)

  shared.shouldConnectToQueueSocket('student1')
  shared.shouldNotOpenQueue('student1')
  shared.shouldNotCloseQueue('student1')

  afterEach(closeStudent1Socket)
  afterEach(stopSocketServer)
})
