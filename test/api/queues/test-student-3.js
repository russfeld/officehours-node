//Require Helpers
const { loginAsStudent3 } = require('../../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-student-3 /api/v1/queues', function () {
  beforeEach(loginAsStudent3)

  describe('GET /', function () {
    shared.shouldReturnAllQueues()
    shared.shouldReturnQueuesAsHelper([1, 2, 3])
    shared.shouldReturnQueuesAsNotEditable([1, 2, 3])
  })

  describe('POST /:id', function () {
    shared.shouldNotAllowEdit(1)
    shared.shouldNotAllowEdit(2)
    shared.shouldNotAllowEdit(3)
  })

  describe('POST /:id/toggle', function () {
    shared.shouldToggleQueue(1)
    shared.shouldToggleQueue(2)
    shared.shouldToggleQueue(3)
  })

  describe('DELETE /:id', function () {
    shared.shouldNotAllowDelete(1)
    shared.shouldNotAllowDelete(2)
    shared.shouldNotAllowDelete(3)
  })

  describe('PUT /', function () {
    shared.shouldNotAllowCreate()
  })
})
