// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
const adminOnly = require('../../middlewares/admin_only')

// Load Models
const User = require('../../models/user')

// Require Admin Role on All Routes
router.use(adminOnly)

/* Get Users List */
router.get('/', async function (req, res, next) {
  let users = await User.query()
    .select('users.id', 'users.eid', 'users.name', 'users.contact_info')
    .withGraphJoined('roles')
    .modifyGraph('roles', (builder) => {
      builder.select('roles.id', 'roles.name')
    })
  res.json(users)
})

/* Update Single User */
router.post('/:id', async function (req, res, next) {
  try {
    // strip out other data from users
    const roles = req.body.user.roles.map(({ id, ...next }) => {
      return {
        id: id,
      }
    })
    await User.query().upsertGraph(
      {
        id: req.params.id,
        name: req.body.user.name,
        contact_info: req.body.user.contact_info,
        roles: roles,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'User Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/* Create New User */
router.put('/', async function (req, res, next) {
  try {
    const user = await User.findOrCreate(req.body.eid)
    res.status(201)
    res.json(user)
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/* Delete Single User */
router.delete('/:id', async function (req, res, next) {
  if (req.params.id == req.user_id) {
    res.status(422)
    res.json({ error: 'Cannot Delete Yourself' })
  }
  try {
    var deleted = await User.query().deleteById(req.params.id)
    if (deleted === 1) {
      res.status(200)
      res.json({ message: 'User Deleted' })
    } else {
      res.status(422)
      res.json({ error: 'User Not Found' })
    }
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

module.exports = router
