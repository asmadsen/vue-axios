import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueAxios from '@/index'
import {VueConstructor} from 'vue/types/vue'
import AxiosWrapper from '@/AxiosWrapper'

describe('Index', () => {
	let vue: VueConstructor
	let instance: VueAxios

	beforeEach(() => {
		vue = createLocalVue()
		instance = VueAxios.instance
	})

	afterEach(() => {
		VueAxios.resetInstance()
	})

	it('Can be registered successfully', () => {
		vue.use(Vuex)
		const store = new Vuex.Store({})
		vue.use(VueAxios)
		const i = new vue({
			store,
			axios: instance
		})
		return instance.initialized
			.catch(a => {
			})
			.finally(() => {
				expect(i.$axios).toBeInstanceOf(AxiosWrapper)
				expect(instance.store).toBeInstanceOf(Vuex.Store)
			})
	})

	it('Will thow error if Vuex is not initialized', () => {
		vue.use(VueAxios)
		const i = new vue({
			axios: instance
		})
		return instance.initialized.catch(error => {
			expect(error).toEqual('Couldn\'t find $store on Vue prototype within 1000 ms, Vuex should be instantiated')
		})
	})

	it('Registered Vuex plugin', () => {
		vue.use(Vuex)
		const store = new Vuex.Store({})
		vue.use(VueAxios)
		const i = new vue({
			store,
			axios: instance
		})
		expect(i.$store['_modules'].root._children).toHaveProperty('authentication')
		expect(i.$store).toBeInstanceOf(Vuex.Store)
		return instance.initialized
			.then(() => {
				expect(instance.store).toBeInstanceOf(Vuex.Store)
			})
	})
})
