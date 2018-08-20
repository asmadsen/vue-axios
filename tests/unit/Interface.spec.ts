import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueAxios from '../../src'
import moxios from 'moxios'
import {AxiosRequestConfig} from 'axios'

describe('Interface', () => {
	let Vue, vue, store, vueAxios

	const error = {
		type: 'InvalidInput',
		message: 'There was some invalid input'
	}

	const errors = [
		{
			type: 'InvalidInput',
			message: 'There was some invalid input in username'
		},
		{
			type: 'InvalidInput',
			message: 'There was some invalid input in password'
		}
	]

	beforeEach(() => {
		Vue = createLocalVue()
		Vue.use(Vuex)
		Vue.use(VueAxios)
		store = new Vuex.Store({})
		vueAxios = new VueAxios()
		vue = new Vue({
			store,
			vueAxios
		})
		moxios.install(vueAxios.Axios.Axios)
	})

	afterEach(() => {
		moxios.uninstall(vueAxios.Axios.Axios)
	})

	it('should be able to register handlers', () => {
		const oneError = jest.fn()
		const multipleErrors = jest.fn()

		moxios.stubOnce('get', '/error', {
			status: 400,
			response: {
				error
			}
		})

		moxios.stubOnce('get', '/errors', {
			status: 400,
			response: {
				errors
			}
		})

		const promises: Array<Promise<any>> = []

		promises.push(vue.$axios
			.handleFirst(oneError)
			.get('/error'))
		promises.push(vue.$axios
			.handle(multipleErrors)
			.get('/errors'))

		return Promise.all(promises)
			.catch(response => {
				expect(oneError).toHaveBeenCalledWith(error, expect.anything())
				expect(multipleErrors).toHaveBeenCalled()
			})
	})

	it('should pass unhandled errors to globally registered handler', () => {
		const globalHandler = jest.fn()
		const unRegisteredGlobalHandler = jest.fn()

		vueAxios.errorHandler.use(globalHandler)
		const ejectedId = vueAxios.errorHandler.use(unRegisteredGlobalHandler)

		vueAxios.errorHandler.eject(ejectedId)

		moxios.stubOnce('get', '/errors', {
			status: 400,
			response: {
				errors
			}
		})

		return vue.$axios
			.get('/errors')
			.catch(error => {
				expect(globalHandler).toHaveBeenCalledWith(errors, error)
				expect(unRegisteredGlobalHandler).not.toHaveBeenCalledWith(errors, error)
			})
	})

	it('should run all request through authentication hook if authentication is specified', () => {
		const authenticationHook = jest.fn(config => {
			return config
		})

		vueAxios.authentication.use(authenticationHook)

		moxios.stubOnce('post', '/login', {
			status: 200
		})

		moxios.stubOnce('get', '/posts', {
			status: 200
		})

		const promises: Array<Promise<any>> = []

		promises.push(vue.$axios
			.unauthenticate()
			.get('/posts')
			.then(() => {
				expect(authenticationHook).not.toHaveBeenCalled()
				return vue.$axios
					.authenticate()
					.post('/login')
					.then(() => {
						expect(authenticationHook).toHaveBeenCalledWith(expect.objectContaining({
							method: 'post',
							url: '/login'
						}), expect.anything())
					})
			})
		)

		return Promise.all(promises)
			.finally(() => {
			})
	})

	it('should auto authenticate specified domains', () => {
		const authenticationHook = jest.fn((config): AxiosRequestConfig => ({
			...config,
			headers: {
				Authorization: 'Bearer someToken'
			}
		}))

		vueAxios.Axios.config.authenticateDomains = [
			'https://domain2.com'
		]

		vueAxios.authentication.use(authenticationHook)

		moxios.stubOnce('post', 'https://domain1.com/login', {
			status: 401
		})

		moxios.stubOnce('post', 'https://domain2.com/login', {
			status: 200
		})

		const promises: Array<Promise<any>> = []

		promises.push(vue.$axios
			.post('https://domain1.com/login')
			.catch(error => error.response)
			.then(() => {
				expect(authenticationHook).not.toHaveBeenCalled()
				return vue.$axios
					.post('https://domain2.com/login')
					.then(response => {
						expect(response.request.headers).toHaveProperty('Authorization', 'Bearer someToken')
						expect(authenticationHook).toHaveBeenCalledWith(expect.objectContaining({
							method: 'post',
							url: 'https://domain2.com/login'
						}), expect.anything())
					})
			})
		)

		return Promise.all(promises)
			.finally(() => {
			})
	})

	it('should use config specified at construct', () => {
		moxios.uninstall(vueAxios.Axios.Axios)
		Vue = createLocalVue()
		Vue.use(VueAxios)
		vueAxios = new VueAxios({
			authenticateDomains: [
				'https://domain1.com'
			]
		})
		vue = new Vue({
			vueAxios
		})
		moxios.install(vueAxios.Axios.Axios)

		expect(vue.$axios.config).toMatchObject({
			authenticateDomains: [
				'https://domain1.com'
			]
		})
		expect(vueAxios.Axios.config).toMatchObject({
			authenticateDomains: [
				'https://domain1.com'
			]
		})
	})

	it('response should be type any', () => {
		moxios.stubOnce('get', '/get', {
			status: 200,
			response: {
				data: [
					'a',
					'b',
					'c'
				]
			}
		})

		return vueAxios.Axios
			.get('/get')
			.then(response => response.data.data)
			.then(data => {
				expect(data).toEqual(expect.arrayContaining(['a', 'b', 'c']))
			})
	})
})