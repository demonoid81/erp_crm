const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

const resolve = dir => path.join(__dirname, '..', dir)

const resolver = function (p, root = true) {
	return path.resolve(root ? process.cwd() : __dirname, p)
}

const createLintingRule = () => ({
	test: /\.(js|vue)$/,
	loader: 'eslint-loader',
	enforce: 'pre',
	include: [resolve('src'), resolve('test')],
	options: {
		formatter: require('eslint-friendly-formatter'),
		emitWarning: !config.dev.showEslintErrorsInOverlay
	}
})

module.exports = (platform, action) => ({
	context: path.resolve(__dirname, '../'),
	entry: {
		app: './src/app.js'
	},
	output: {
		path: config.build.assetsRoot,
		filename: `app.${platform}.js`,
		publicPath: process.env.NODE_ENV === 'production'
			? config.build.assetsPublicPath
			: config.dev.assetsPublicPath
	},
	resolve: {
		extensions: [
			`.${platform}.css`,
			'.css',
			`.${platform}.less`,
			'.less',
			`.${platform}.scss`,
			'.scss',
			`.${platform}.sass`,
			'.sass',
			`.${platform}.js`,
			'.js',
			'.vue',
			'.json'
		],
		alias: {
			'@': resolve('src'),
			'@C': resolve('src/components'),
			'@P': resolve('src/pages')
		}
	},
	module: {
		rules: [
			// ...(config.dev.useEslint ? [createLintingRule()] : []),
			{
				test: /\.vue$/,
				loaders: [{
					loader: 'vue-loader',
				    options: vueLoaderConfig
				}, {
					loader: resolver('./loader?vue', false)
				}]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: [{
					loader: 'babel-loader'
				}, {
					loader: resolver('./loader', false)
				}]
			},
			{
				test: /\.(png|jpe?g|gif)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('media/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	},
	node: {
		setImmediate: false,
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty'
	}
})
