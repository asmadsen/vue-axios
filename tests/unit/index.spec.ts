import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueAxios from '../../src/index'
import {VueConstructor} from 'vue/types/vue'
import VueAxiosInterface from '../../src/VueAxiosInterface'

describe('Index', () => {
	let Vue: VueConstructor
	let vueAxios: VueAxios

	beforeEach(() => {
		Vue = createLocalVue()
		vueAxios = new VueAxios()
		Vue.use(VueAxios)
	})

	it('should register plugin', () => {
		Vue.use(Vuex)
		const store = new Vuex.Store({})
		const vue = new Vue({
			store,
			vueAxios
		})
		return vueAxios.initialized.finally(() => {
			expect(vue.$axios).toBeInstanceOf(VueAxiosInterface)
			expect(vueAxios.store).toBeInstanceOf(Vuex.Store)
		})
	})

	it('should be accesible in sub-components', done => {
		Vue.use(Vuex)
		const store = new Vuex.Store({})
		const App = Vue.component('App', {
			created() {
				expect(this.$axios).toBeInstanceOf(VueAxiosInterface)
				done()
			},
			render: r => r('div')
		})
		const vue = new Vue({
			store,
			vueAxios,
			components: {
				App
			},
			render: r => r(App)
		}).$mount()
	})
})
