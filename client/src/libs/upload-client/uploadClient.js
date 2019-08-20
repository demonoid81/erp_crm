'use strict'

const { ApolloLink, Observable } = require('apollo-link')

const {
	selectURI,
	selectHttpOptionsAndBody,
	fallbackHttpConfig,
	serializeFetchParameter,
	createSignalIfSupported,
	parseAndCheckHttpResponse
} = require('apollo-link-http-common')

const { extractFiles } = require('./extractFiles')

export const createUploadLink = ({
	uri: fetchUri = '/graphql',
	fetch: linkFetch = fetch,
	fetchOptions,
	credentials,
	headers,
	includeExtensions
} = {}) => {
	const linkConfig = {
		http: {
			includeExtensions
		},
		options: fetchOptions,
		credentials,
		headers
	}
	return new ApolloLink(operation => {
		const uri = selectURI(operation, fetchUri)
		const context = operation.getContext()
		const contextConfig = {
			http: context.http,
			options: context.fetchOptions,
			credentials: context.credentials,
			headers: context.headers
		}
		const { options, body } = selectHttpOptionsAndBody(
			operation,
			fallbackHttpConfig,
			linkConfig,
			contextConfig
		)
		const files = extractFiles(body)
		const payload = serializeFetchParameter(body, 'Payload')
		if (files.length) {
			delete options.headers['content-type']
			options.body = new FormData()
			options.body.append('operations', payload)
			options.body.append(
				'map',
				JSON.stringify(
					files.reduce((map, { path }, index) => {
						map[`${index}`] = [path]
						return map
					}, {})
				)
			)
			files.forEach(({ file }, index) =>
				options.body.append(index, file, file.name)
			)
		} else {
			options.body = payload
		}
		return new Observable(observer => {
			const { controller, signal } = createSignalIfSupported()
			if (controller) options.signal = signal
			linkFetch(uri, options)
				.then(response => {
					operation.setContext({
						response
					})
					return response
				})
				.then(parseAndCheckHttpResponse(operation))
				.then(result => {
					observer.next(result)
					observer.complete()
				})
				.catch(error => {
					if (error.name === 'AbortError') return
					if (error.result && error.result.errors && error.result.data) {
						observer.next(error.result)
					}
					observer.error(error)
				})
			return () => {
				if (controller) controller.abort()
			}
		})
	})
}
