import PrettyInput from './prettyInput.vue'
import PrettyCheckbox from './prettyCheckbox.js'
import PrettyRadio from './prettyRadio.js'

export default {
	install(Vue, options) {
		Vue.component('p-input', PrettyInput)
		Vue.component('p-check', PrettyCheckbox)
		Vue.component('p-radio', PrettyRadio)
	}
}
