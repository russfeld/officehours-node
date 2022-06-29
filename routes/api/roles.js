// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
const adminOnly = require('../../middlewares/admin-only')

// Load Models
const Role = require('../../models/role')

// Require Admin Role on All Routes
router.use(adminOnly)

/* Get Roles List */
router.get('/', async function (req, res, next) {
  let roles = await Role.query().select('id', 'name')
  res.json(roles)
})

module.exports = router
