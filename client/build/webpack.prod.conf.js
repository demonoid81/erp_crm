const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const WorkboxPlugin = require('workbox-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const config = require('../config')
const utils = require('./utils')

const env = require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
	mode: 'production',
	module: {
		rules: utils.styleLoaders({
			sourceMap: config.build.productionSourceMap,
			extract: true,
			usePostCSS: true
		})
	},
	devtool: config.build.productionSourceMap ? config.build.devtool : false,
	output: {
		path: config.build.assetsRoot,
		filename: utils.assetsPath('js/[name].[chunkhash].js'),
		chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				default: false,
				vendors: false,
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all',
					priority: 20
				},
				common: {
					name: 'common',
					minChunks: 2,
					chunks: 'async',
					priority: 10,
					reuseExistingChunk: true,
					enforce: true
				}
			}
		},
		runtimeChunk: {
			name: 'manifest'
		},
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true,
				sourceMap: config.build.productionSourceMap
			}),
			new OptimizeCSSPlugin({
				cssProcessorOptions: config.build.productionSourceMap
					? { safe: true, map: { inline: false } }
					: { safe: true }
			})
		]
	},
	plugins: [
		new CleanWebpackPlugin({
			verbose: true
		}),
		// new WebpackMd5Hash(),
		// http://vuejs.github.io/vue-loader/en/workflow/production.html
		new webpack.DefinePlugin({
			'process.env': env
		}),
		new VueLoaderPlugin(),
		new CKEditorWebpackPlugin({ language: 'ru' }),
		// extract css into its own file
		new MiniCssExtractPlugin({
			filename: utils.assetsPath('css/[name].[contenthash].css'),
			chunkFilename: 'css/[id].[contenthash].css'
		}),
		// generate dist index.html with correct asset hash for caching.
		// you can customize output by editing /index.html
		// see https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: config.build.index,
			template: 'index.html',
			inject: true,
			hash: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
				// more options:
				// https://github.com/kangax/html-minifier#options-quick-reference
			},
			// necessary to consistently work with multiple chunks via CommonsChunkPlugin
			chunksSortMode: 'dependency'
		}),
		// keep module.id stable when vendor modules does not change
		new webpack.HashedModuleIdsPlugin(),
		// enable scope hoisting
		new webpack.optimize.ModuleConcatenationPlugin(),
		// copy custom static assets
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, '../static'),
				to: config.build.assetsSubDirectory,
				ignore: ['.*']
			}
		]),
		new WorkboxPlugin.InjectManifest({
			swSrc: './src/sw.js',
		})
	]
})

if (config.build.productionGzip) {
	const CompressionWebpackPlugin = require('compression-webpack-plugin')
	webpackConfig.plugins.push(
		new CompressionWebpackPlugin({
			filename: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				`\\.(${
					config.build.productionGzipExtensions.join('|')
				})$`
			),
			threshold: 10240,
			minRatio: 0.8
		})
	)
}

if (config.build.bundleAnalyzerReport) {
	const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
	webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig