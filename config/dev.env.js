var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  // An empty base makes the browser request /v1/... from the dev server
  // itself, which forwards to the API via dev.proxyTable (config/index.js).
  // Staying same-origin avoids a CORS preflight against coresys.local.
  // To call the API directly instead, set '"http://coresys.local"' here.
  API_BASE: '"http://coresys.local"'
})
