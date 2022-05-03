var CASAuthentication = require('node-cas-authentication')

var cas = new CASAuthentication({
  cas_url: process.env.CAS_URL,
  service_url: process.env.CAS_SERVICE_URL,
  cas_version: '3.0',
  renew: false,
  is_dev_mode: process.env.CAS_DEV_MODE === 'true',
  dev_mode_user: process.env.CAS_DEV_USER,
  dev_mode_info: {},
  session_name: 'cas_user',
  session_info: 'cas_userinfo',
  destroy_session: true,
  return_to: process.env.CAS_SERVICE_URL + process.env.CAS_REDIRECT_URL,
})

module.exports = cas
