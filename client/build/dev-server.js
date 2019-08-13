require('./check-versions')()

const path = require('path')
const Koa = require('koa')
const logger = require('koa-logger')
const favicon = require('koa-favicon')
const webpack = require('webpack')
const proxyMiddleware = require('koa-proxies')
const config = require('../config')
const webpackConfig = require('./webpack.dev.conf')

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const { proxyTable } = config.dev
const app = new Koa()
// app.use(favicon(`${__dirname}/favicon.ico`))
app.use(logger())

const compiler = webpack(webpackConfig)

// proxy api requests
Object.keys(proxyTable).forEach(context => {
	let options = proxyTable[context]
	if (typeof options === 'string') {
		options = { target: options }
	}
	app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('koa2-history-api-fallback')())

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(require('koa-static-server')(
	{
		rootDir: staticPath,
		rootPath: './static'
	}
))

console.log('> Starting dev server...')

const devMiddleware = {
	publicPath: process.env.NODE_ENV === 'production'
		? config.build.assetsPublicPath
		: config.dev.assetsPublicPath,
	logLevel: 'debug'
}

const hotClient = {
	logLevel: 'debug',
	heartbeat: 5000
}

const devServer = (compiler, opts) => {
	const expressMiddleware = require('webpack-dev-middleware')(compiler, opts)
	async function middleware(ctx, next) {
		await expressMiddleware(ctx.req, {
			end: content => {
				ctx.body = content
			},
			getHeader: ctx.get.bind(ctx),
			setHeader: ctx.set.bind(ctx),
			locals: ctx.state
		}, next)
	}
	middleware.getFilenameFromUrl = expressMiddleware.getFilenameFromUrl
	middleware.waitUntilValid = expressMiddleware.waitUntilValid
	middleware.invalidate = expressMiddleware.invalidate
	middleware.close = expressMiddleware.close
	middleware.fileSystem = expressMiddleware.fileSystem
	return middleware
}

const hotServer = (compiler, opts) => {
	const { PassThrough } = require('stream')
	const expressMiddleware = require('webpack-hot-middleware')(compiler, opts)
	return async (ctx, next) => {
		const stream = new PassThrough()
		ctx.body = stream
		await expressMiddleware(ctx.req, {
			write: stream.write.bind(stream),
			writeHead: (status, headers) => {
				ctx.status = status
				ctx.set(headers)
			},
			end: () => {
				stream.end()
			}
		}, next)
	}
}

app.use(devServer(compiler, devMiddleware))
app.use(hotServer(compiler, hotClient))

const port = process.env.PORT || config.dev.port
const uri = `localhost:${port}`
app.listen(port, () => console.log(`> Listening at ${uri}\n`))