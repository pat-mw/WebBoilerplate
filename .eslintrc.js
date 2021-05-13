// useful for error correction
// npm install --save-dev eslint eslint-config-standard eslint-loader eslint-plugin-import eslint-plugin-promise eslint-plugin-standard eslint-plugin-node

module.exports = {
  root: true,
  extends: ['standard'],
  globals: {
    IS_DEVELOPMENT: 'readonly'
  },
  parserOptions: {
    ecmasVersion: 2020
  }
}
