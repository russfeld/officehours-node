/* Check if User is Admin */
async function adminOnly(req, res, next) {
  if (req.is_admin) {
    next()
  } else {
    res.status(403)
    res.json({ error: 'Admins Only' })
  }
}

module.exports = adminOnly
