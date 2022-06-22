// Load Libraries
const express = require('express')
const router = express.Router()

// Load Models
const Request = require('../../models/request')

/* Get Whole Request List */
router.get('/:id', async function (req, res, next) {
  const requests = await Request.query()
    .where('queue_id', req.params.id)
    .withGraphFetched('user')
    .modifyGraph('user', (builder) => {
      builder.select('users.id', 'users.eid', 'users.name')
    })
  res.json(requests)
})

module.exports = router
