import Vue from 'vue'
import { ApolloClient  } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { createPersistedQueryLink } from "apollo-link-persisted-queries"
import { onError } from "apollo-link-error"
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import VueApollo from 'vue-apollo'
import store from './store'
import router from './router'
import App from './app.vue'
import config from '../config'
import { createUploadLink, customFetch } from './libs/upload-client'
import ProgressBar from './components/progressBar'

Vue.prototype.$config = config

const progressBarOptions = {
	color: '#1d71b8',
	failedColor: '#ff0100',
	thickness: '2px',
	transition: {
		speed: '0.2s',
		opacity: '0.6s',
		termination: 300
	},
	autoRevert: true,
	location: 'top',
	inverse: false
}

const httpLink = createUploadLink({
	uri: 'http://localhost:8001/api',
	fetch: typeof window === 'undefined' ? global.fetch : customFetch,
	fetchOptions: {
		onProgress: (progress) => {
			// todo инкапсуляция прогреccбара в объект uuid='uploadbar'
			console.log(`${progress.loaded / progress.total * 100}% uploaded`)
		}
	}
})

const httpLinkAuth = setContext(() => {
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			// ...headers,
			// Authorization: getters.authToken ? `Bearer ${getters.authToken}` : null
		}
	}
})

const wsLink = new WebSocketLink({
    uri: 'ws://localhost:8001/ws',
    options: {
        reconnect: true
    }
})

const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query)
		return kind === 'OperationDefinition' &&
			operation === 'subscription'
	},
	wsLink,
	httpLinkAuth.concat(httpLink)
)

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        )
    if (networkError) console.log(`[Network error]: ${networkError}`)
})

const cache = new InMemoryCache({
	dataIdFromObject: object => object.key || null
})

export const apolloClient = new ApolloClient({
	link: createPersistedQueryLink().concat(errorLink.concat(link)),
	cache,
	connectToDevTools: true,
})

Vue.use(ProgressBar, progressBarOptions)
Vue.use(VueApollo)

const apolloProvider = new VueApollo({
	defaultClient: apolloClient,
})

const app = new Vue ({
    store,
	router,
	apolloProvider,
    render: h => h(App)
})

/*--@web--*/
app.$mount('#app')
/*--@web--*/

/*--@native--*/
app.$start()
/*--@native--*/
