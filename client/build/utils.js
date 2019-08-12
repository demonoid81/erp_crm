const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { styles } = require('@ckeditor/ckeditor5-dev-utils')
const config = require('../config')
const packageConfig = require('../package.json')

const resolve = function (p, root = true) {
    return path.resolve(root ? process.cwd() : __dirname, p)
}
  
const package = require(resolve('package.json'))

exports.assetsPath = function (_path) {
	const assetsSubDirectory = process.env.NODE_ENV === 'production'
		? config.build.assetsSubDirectory
		: config.dev.assetsSubDirectory

	return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
	options = options || {}

	const cssLoader = {
		loader: 'css-loader',
		options: {
			sourceMap: options.sourceMap
		}
	}

	// generate loader string to be used with extract text plugin
	function generateLoaders(loader, loaderOptions) {
		const loaders = [ resolve('./loader', false), cssLoader]

		if (loader) {
			loaders.push({
				loader: `${loader}-loader`,
				options: Object.assign({}, loaderOptions, {
					sourceMap: options.sourceMap
				})
			})
		}

		if (options.extract) {
			return [MiniCssExtractPlugin.loader].concat(loaders)
		}
		return ['vue-style-loader'].concat(loaders)
	}

	return {
		css: generateLoaders(),
		postcss: generateLoaders(),
		less: generateLoaders('less', { javascriptEnabled: true, relativeUrls: true }),
		sass: generateLoaders('sass', { indentedSyntax: true }),
		scss: generateLoaders('sass'),
		stylus: generateLoaders('stylus'),
		styl: generateLoaders('stylus')
	}
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
	const output = []
	const loaders = exports.cssLoaders(options)

	for (const extension in loaders) {
		const loader = loaders[extension]
		output.push({
			test: new RegExp(`\\.${extension}$`),
			use: loader
        })
	}

	return output
}

exports.createNotifierCallback = () => {
	const notifier = require('node-notifier')

	return (severity, errors) => {
		if (severity !== 'error') return

		const error = errors[0]
		const filename = error.file && error.file.split('!').pop()

		notifier.notify({
			title: packageConfig.name,
			message: `${severity}: ${error.name}`,
			subtitle: filename || '',
			icon: path.join(__dirname, 'logo.png')
		})
	}
}

exports.check = () => {
    if (!fs.existsSync(resolve('App_Resources'))) {
      throw new Error('Directory "App_resources" is required in your root folder.')
    } else if (!fs.existsSync(resolve('src/assets'))) {
        throw new Error('Directory "assets" is required in your "src" folder.')
    } else if (!package.nativescript || !package.nativescript.id) {
        throw new Error('Your need to specific your App ID in your package.json.')
    }
}