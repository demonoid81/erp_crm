const base = require('./base')
const native = require('./native')
const web = require('./web')
const merge = require('webpack-merge')
const { check } = require('./utils')

const configs = {
  ios: native,
  android: native,
  base,
  web
}

module.exports = () => {
  try {
    check()
    const { platform, action } = process.env

    return !platform
      ? [
          merge(base('ios', action), native('ios', action, true)),
          merge(base('android', action), native('android', action, true))
        ]
      : [merge(base(platform, action), configs[platform](platform, action))]
  } catch (error) {
    throw new Error(`\x1b[31m${error}\x1b[0m`)
  }
}
