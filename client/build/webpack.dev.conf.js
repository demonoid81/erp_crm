const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const WebpackShellPlugin = require('webpack-synchronizable-shell-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const config = require('../config')
const utils = require('./utils')
const { HOST, platform, action  } = process.env
const PORT = process.env.PORT && Number(process.env.PORT)

// get base config
const baseConfig = baseWebpackConfig(platform)

Object.keys(baseConfig.entry).forEach(name => {
	baseConfig.entry[name] = ['./build/dev-client'].concat(baseConfig.entry[name])
})

module.exports = merge(baseConfig, {
	mode: 'development',
	module: {
		rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
	},
	devtool: config.dev.devtool,
	devServer: {
		clientLogLevel: 'warning',
		historyApiFallback: {
			rewrites: [
				{ from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }
			]
		},
		hot: true,
		contentBase: false,
		compress: true,
		host: HOST || config.dev.host,
		port: PORT || config.dev.port,
		open: config.dev.autoOpenBrowser,
		overlay: config.dev.errorOverlay
			? { warnings: false, errors: true }
			: false,
		publicPath: config.dev.assetsPublicPath,
		proxy: config.dev.proxyTable,
		quiet: true,
		watchOptions: {
			poll: config.dev.poll
		}
	},
	plugins: [
		new WebpackShellPlugin({
			safe: true,
			onBuildStart: {
			  scripts: ['echo "\n\x1b[33m------------ WEB ------------\x1b[0m\n"']
			}
		}),
		new FriendlyErrorsPlugin({
			compilationSuccessInfo: {
				messages: ['Your application is compile']
			},
			onErrors: config.dev.notifyOnErrors
				? utils.createNotifierCallback()
				: undefined
		}),
		new CircularDependencyPlugin({
			exclude: /a\.js|node_modules/,
			failOnError: false,
			allowAsyncCycles: true,
			cwd: process.cwd()
		}),
		new webpack.DefinePlugin({
			'process.env': config.dev.env,
			CURRENT_PLATFORM: JSON.stringify(platform)
		}),
		new webpack.HotModuleReplacementPlugin(),
		new VueLoaderPlugin(),
		new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
		new webpack.NoEmitOnErrorsPlugin(),
		new HtmlWebpackPlugin({
			filename: './index.html',
			template: 'index.html',
			inject: true,
			hash: true
		}),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, '../static'),
				to: config.dev.assetsSubDirectory,
				ignore: ['.*']
			}
		])
	]
})