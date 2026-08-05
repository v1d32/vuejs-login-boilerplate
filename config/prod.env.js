module.exports = {
  NODE_ENV: '"production"',

  // OAuth2 password grant, consumed by src/components/Login.vue.
  // These are substituted verbatim by webpack's DefinePlugin, so string
  // values need their own embedded quotes and numbers are left bare.
  API_BASE: '"http://coresys.local"',
  OAUTH_CLIENT_ID: '2',
  OAUTH_CLIENT_SECRET: '"IQAOJNz89a0O4ZMz6Z3gUZsSkeMrtDICQanSIuiL"'
}
