//Require Helpers
const { loginAsAdmin, loginAsStudent4 } = require('../../helpers')
const {
  startSocketServer,
  connectAdminSocket,
  connectStudent4Socket,
  closeAdminSocket,
  closeStudent4Socket,
  stopSocketServer,
  selectSocketQueue1,
  selectSocketQueue3,
} = require('../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-admin socket queues', function () {
  beforeEach(loginAsAdmin)
  beforeEach(loginAsStudent4)
  beforeEach(startSocketServer)
  beforeEach(selectSocketQueue3)
  beforeEach(connectAdminSocket)
  beforeEach(connectStudent4Socket)

  shared.shouldConnectToQueueSocket('admin')
  shared.shouldCloseQueue('admin')
  shared.shouldNotJoinQueueAsHelper('admin')

  shared.shouldTakeRequest('admin')
  shared.shouldNotTakeBadRequest('admin')
  shared.shouldEmitQueueUpdateAfterTake('admin', 'student4')
  shared.shouldStoreRequestAfterTake('admin')

  shared.shouldDeleteRequest('admin')
  shared.shouldNotDeleteBadRequest('admin')
  shared.shouldEmitQueueRemoveAfterDelete('admin', 'student4')
  shared.shouldRemoveRequestAfterDelete('admin')

  shared.shouldFinishRequest('admin')
  shared.shouldNotFinishBadRequest('admin')
  shared.shouldEmitQueueRemoveAfterFinish('admin', 'student4')
  shared.shouldRemoveRequestAfterFinish('admin')

  shared.shouldRequeueRequest('admin')
  shared.shouldNotRequeueBadRequest('admin')
  shared.shouldEmitQueueRemoveAfterRequeue('admin', 'student4')
  shared.shouldRemoveRequestAfterRequeue('admin')
  shared.shouldEmitQueueUpdateAfterRequeue('admin', 'student4')
  shared.shouldStoreRequestAfterRequeue('admin')

  afterEach(closeStudent4Socket)
  afterEach(closeAdminSocket)
  afterEach(stopSocketServer)
})

describe('test-admin socket queues 2', function () {
  beforeEach(loginAsAdmin)
  beforeEach(loginAsStudent4)
  beforeEach(startSocketServer)
  beforeEach(selectSocketQueue1)
  beforeEach(connectAdminSocket)
  beforeEach(connectStudent4Socket)

  shared.shouldOpenQueue('admin')
  shared.shouldEmitQueueOpeningAfterOpening('admin', 'student4')
  shared.shouldEmitQueueClosingAfterClosing('admin', 'student4')
  shared.shouldNotTakeRequestClosedQueue('admin')
  shared.shouldNotDeleteRequestClosedQueue('admin')
  shared.shouldNotFinishRequestClosedQueue('admin')
  shared.shouldNotRequeueRequestClosedQueue('admin')

  afterEach(closeStudent4Socket)
  afterEach(closeAdminSocket)
  afterEach(stopSocketServer)
})
