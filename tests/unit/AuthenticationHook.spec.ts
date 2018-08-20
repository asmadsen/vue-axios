import moxios from 'moxios'
import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueAxios from '../../src/index'
import VueAxiosInterface from '../../src/VueAxiosInterface'

describe('Authentication Hook', () => {
	let Vue
	let vue
	let store
	let vueAxios

	beforeEach(() => {
		Vue = createLocalVue()
		Vue.use(VueAxios)
		Vue.use(Vuex)
		vueAxios = new VueAxios()
		store = new Vuex.Store({})
		moxios.install(vueAxios.Axios.Axios)
		vue = new Vue({
			vueAxios,
			store
		})
	})

	afterEach(() => {
		moxios.uninstall(vueAxios.Axios.Axios)
	})

	it('should register authentication hook', () => {
		const authenticationHook = (request, {axios, store}) => {
			expect(axios).toBeInstanceOf(VueAxiosInterface)
			expect(store).toBeInstanceOf(Vuex.Store)
			return Promise.resolve(request)
		}
		vueAxios.authentication.use(authenticationHook)

		moxios.stubOnce('get', '/', {
			status: 200,
		})

		return vueAxios
			.initialized
			.finally(() => {
				return vue.$axios
					.authenticate()
					.get('/')
					.then(() => {
					})
			})
	})

	it('authenticate or unathenticate should only apply to current request', (done) => {
		const authenticationHook = jest.fn((request, {axios, store}) => {
			return Promise.resolve(request)
		})
		vueAxios.authentication.use(authenticationHook)

		moxios.stubOnce('get', '/', {
			status: 200,
		})

		moxios.stubOnce('get', '/after', {
			status: 200,
		})

		return vueAxios
			.initialized
			.finally(() => {
				return vue.$axios
					.authenticate()
					.get('/')
					.then(() => {
						expect(authenticationHook).toHaveBeenCalledWith(
							expect.objectContaining({url: '/', method: 'get'}),
							expect.anything()
						)
						return vue.$axios
							.get('/after')
							.then(response => {
								expect(response.request.authenticate).not.toBeDefined()
								done()
							})
					})
			})
	})
})