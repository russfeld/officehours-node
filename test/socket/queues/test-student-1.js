//Require Helpers
const { loginAsStudent1 } = require('../../helpers')
const {
  startSocketServer,
  connectStudent1Socket,
  closeStudent1Socket,
  stopSocketServer,
  selectSocketQueue1,
  selectSocketQueue2,
  selectSocketQueue3,
} = require('../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-student-1 socket queues', function () {
  beforeEach(loginAsStudent1)
  beforeEach(startSocketServer)
  beforeEach(selectSocketQueue3)
  beforeEach(connectStudent1Socket)

  shared.shouldConnectToQueueSocket('student1')
  shared.shouldNotCloseQueue('student1')
  shared.shouldNotTakeRequest('student1')

  afterEach(closeStudent1Socket)
  afterEach(stopSocketServer)
})

describe('test-student-1 socket queues', function () {
  beforeEach(loginAsStudent1)
  beforeEach(startSocketServer)
  beforeEach(selectSocketQueue1)
  beforeEach(connectStudent1Socket)

  shared.shouldOpenQueue('student1')

  afterEach(closeStudent1Socket)
  afterEach(stopSocketServer)
})

describe('test-student-1 socket queues', function () {
  beforeEach(loginAsStudent1)
  beforeEach(startSocketServer)
  beforeEach(selectSocketQueue2)
  beforeEach(connectStudent1Socket)

  shared.shouldNotOpenQueue('student1')

  afterEach(closeStudent1Socket)
  afterEach(stopSocketServer)
})
