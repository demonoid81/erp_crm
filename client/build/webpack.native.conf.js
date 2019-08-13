

const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackShellPlugin = require('webpack-synchronizable-shell-plugin')
const NativeScriptVueTarget = require('nativescript-vue-target')
const NativeScriptVueExternals = require('nativescript-vue-externals')

module.exports = (platform, action, both) => ({
  target: NativeScriptVueTarget,
  output: {
    path: resolve('./dist/native/app')
  },
  externals: NativeScriptVueExternals,
  resolve: {
    alias: {
      vue$: 'nativescript-vue'
    },
    modules: ['node_modules', 'node_modules/tns-core-modules']
  },
  node: {
    http: false,
    timers: false,
    setImmediate: false,
    fs: 'empty'
  },
  plugins: [
    new CopyWebpackPlugin([{
        from: resolve('src/assets'),
        to: resolve('dist/native/app')
      },
      {
        from: resolve('App_Resources'),
        to: resolve('dist/native/app/App_Resources'),
        transform: content => appify(content)
      },
      {
        from: resolve('package.json'),
        to: resolve('dist/native/app/package.json'),
        transform: content => {
          return stringify(packageify(content, true), {
            main: 'app.js',
            android: {
              v8Flags: '--expose_gc'
            }
          })
        }
      },
      {
        from: resolve('package.json'),
        to: resolve('dist/native/package.json'),
        transform: content => {
          return stringify(packageify(content), {
            dependencies: nativeDep(content)
          })
        }
      }
    ]),
    new WebpackShellPlugin({
      safe: true,
      onBuildStart: {
        scripts: [
          `echo "\n\x1b[33m------------ ${platform.toUpperCase()} ------------\x1b[0m\n"`
        ]
      },
      onBuildEnd: {
        scripts: both ?
          [
            'npm i --prefix dist/native',
            `tns --path dist/native ${action} ios`,
            `tns --path dist/native ${action} android`
          ] :
          [
            'npm i --prefix dist/native',
            `tns --path dist/native ${action} ${platform}`
          ],
        parallel: true
      }
    })
  ]
})