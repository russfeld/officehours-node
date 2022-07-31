//Require Helpers
const { loginAsStudent3, loginAsStudent4 } = require('../../helpers')
const {
  startSocketServer,
  connectStudent3Socket,
  closeStudent3Socket,
  stopSocketServer,
  selectSocketQueue3,
  connectStudent4Socket,
  closeStudent4Socket,
} = require('../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-student-3 socket queues', function () {
  beforeEach(loginAsStudent3)
  beforeEach(loginAsStudent4)
  beforeEach(startSocketServer)
  beforeEach(selectSocketQueue3)
  beforeEach(connectStudent3Socket)
  beforeEach(connectStudent4Socket)

  shared.shouldConnectToQueueSocket('student3')
  shared.shouldCloseQueue('student3')
  shared.shouldNotJoinQueueAsHelper('student3')
  shared.shouldTakeRequest('student3')
  shared.shouldNotTakeBadRequest('student3')
  shared.shouldEmitQueueUpdateAfterTake('student3', 'student4')
  shared.shouldStoreRequestAfterTake('student3')

  afterEach(closeStudent4Socket)
  afterEach(closeStudent3Socket)
  afterEach(stopSocketServer)
})
