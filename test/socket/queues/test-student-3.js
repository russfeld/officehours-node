//Require Helpers
const { loginAsStudent3, loginAsStudent4 } = require('../../helpers')
const {
  startSocketServer,
  connectStudent3Socket,
  closeStudent3Socket,
  stopSocketServer,
  selectSocketQueue1,
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

  shared.shouldDeleteRequest('student3')
  shared.shouldNotDeleteBadRequest('student3')
  shared.shouldEmitQueueRemoveAfterDelete('student3', 'student4')
  shared.shouldRemoveRequestAfterDelete('student3')

  shared.shouldFinishRequest('student3')
  shared.shouldNotFinishBadRequest('student3')
  shared.shouldEmitQueueRemoveAfterFinish('student3', 'student4')
  shared.shouldRemoveRequestAfterFinish('student3')

  shared.shouldRequeueRequest('student3')
  shared.shouldNotRequeueBadRequest('student3')
  shared.shouldEmitQueueRemoveAfterRequeue('student3', 'student4')
  shared.shouldRemoveRequestAfterRequeue('student3')
  shared.shouldEmitQueueUpdateAfterRequeue('student3', 'student4')
  shared.shouldStoreRequestAfterRequeue('student3')

  afterEach(closeStudent4Socket)
  afterEach(closeStudent3Socket)
  afterEach(stopSocketServer)
})

describe('test-student-3 socket queues 2', function () {
  beforeEach(loginAsStudent3)
  beforeEach(loginAsStudent4)
  beforeEach(startSocketServer)
  beforeEach(selectSocketQueue1)
  beforeEach(connectStudent3Socket)
  beforeEach(connectStudent4Socket)

  shared.shouldOpenQueue('student3')
  shared.shouldEmitQueueOpeningAfterOpening('student3', 'student4')
  shared.shouldEmitQueueClosingAfterClosing('student3', 'student4')
  shared.shouldNotTakeRequestClosedQueue('student3')
  shared.shouldNotDeleteRequestClosedQueue('student3')
  shared.shouldNotFinishRequestClosedQueue('student3')

  afterEach(closeStudent4Socket)
  afterEach(closeStudent3Socket)
  afterEach(stopSocketServer)
})
