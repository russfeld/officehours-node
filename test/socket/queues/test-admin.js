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

  afterEach(closeStudent4Socket)
  afterEach(closeAdminSocket)
  afterEach(stopSocketServer)
})

describe('test-admin socket events queues', function () {
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

  afterEach(closeStudent4Socket)
  afterEach(closeAdminSocket)
  afterEach(stopSocketServer)
})
