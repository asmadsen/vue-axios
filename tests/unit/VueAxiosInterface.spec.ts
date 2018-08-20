import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueAxios from '../../src/index'
import moxios from 'moxios'
import VueAxiosInterface from '../../src/VueAxiosInterface'

describe('Vue Axios Interface', () => {
	let vue
	let store
	let vueAxios

	beforeEach(() => {
		const Vue = createLocalVue()
		vueAxios = new VueAxios()
		Vue.use(Vuex)
		store = new Vuex.Store({})
		Vue.use(VueAxios)
		vue = new Vue({
			store,
			vueAxios
		})
	})


	it('should have access to store', () => {
		return vueAxios.initialized.finally(() => {
			const store = vueAxios.Axios.store
			expect(store).toBeInstanceOf(Vuex.Store)
		})
	})

	it('should be accessible from vue instance', () => {
		return vueAxios.initialized.finally(() => {
			expect(vue.$axios).toBeInstanceOf(VueAxiosInterface)
		})
	})

	it('should encapsulate axios behaviour', () => {
		const methods = [
			'patch', 'put', 'post', 'head', 'delete', 'get'
		]
		moxios.install(vueAxios.Axios.Axios)
		const promises = methods.map(method => {
			moxios.stubOnce(method, '/url', {
				status: 200,
				response: 'success'
			})
			return vue.$axios[method]('/url')
				.then(response => response.data)
				.then(status => status === 'success' || method)
		})
		return Promise.all(promises)
			.then(results => {
				results
					.forEach(result => {
						expect(result).toEqual(true)
					})
				moxios.uninstall(vueAxios.Axios.Axios)
			})
	})

	it('should have handle and handle first methods', () => {
		return vueAxios.initialized.finally(() => {
			expect(typeof vue.$axios.handle).toEqual('function')
			expect(typeof vue.$axios.handleFirst).toEqual('function')
		})
	})

	it('Generic handler', (done) => {
		moxios.install(vueAxios.Axios.Axios)
		const errors = [
			{
				type: 'InputValidation',
				message: 'Some some some some'
			},
			{
				type: 'InputValidation',
				message: 'Some other error'
			},
			{
				type: 'AuthenticationError',
				message: 'User not authenticated'
			}
		]
		moxios.stubOnce('get', '/url', {
			status: 400,
			response: JSON.stringify({
				errors
			})
		})
		const mock = jest.fn(errors => {
			throw errors
		})
		const mock2 = jest.fn(errors => {
			return Promise.reject(errors[3])
		})
		vue.$axios
			.handle(mock, 'InputValidation')
			.handle(mock2)
			.get('/url')
			.finally(() => {
				expect(mock).toHaveBeenCalledWith(expect.arrayContaining([
					{
						type: 'InputValidation',
						message: 'Some other error'
					},
					{
						type: 'InputValidation',
						message: 'Some some some some'
					},
				]), expect.anything())
				expect(mock2).toHaveBeenCalledWith(expect.arrayContaining(errors), expect.anything())
				moxios.uninstall(vueAxios.Axios.Axios)
				done()
			})
	})

	it('Handle first error', done => {
		const errorMock = jest.fn((unhandledErrors, context) => {
			expect(unhandledErrors).toContainEqual({
				type: 'InputValidation',
				message: 'Some other error'
			})
		})
		vueAxios.errorHandler.use(errorMock)
		moxios.install(vueAxios.Axios.Axios)
		const errors = [
			{
				type: 'InputValidation',
				message: 'Some some some some'
			},
			{
				type: 'InputValidation',
				message: 'Some other error'
			}
		]
		moxios.stubOnce('get', '/url', {
			status: 400,
			response: JSON.stringify({
				errors
			})
		})
		const mock = jest.fn(error => {
			throw error
		})
		vue.$axios
			.handleFirst(mock, 'InputValidation')
			.get('/url')
			.finally(() => {
				expect(mock).toHaveBeenCalledWith({
					type: 'InputValidation',
					message: 'Some some some some'
				}, expect.anything())
				expect(errorMock).toHaveBeenCalled()
				moxios.uninstall(vueAxios.Axios.Axios)
				done()
			})
	})

	it('4xx and 5xx status codes gets converted to errors', () => {
		const errorMock = jest.fn()
		vueAxios.errorHandler = errorMock
		moxios.install(vueAxios.Axios.Axios)
		moxios.stubOnce('get', '/url', {
			status: 400
		})
		return vue.$axios
			.get('/url')
			.finally(() => {
				expect(errorMock).toHaveBeenCalledWith([{
					type: 'HttpStatus',
					message: 'Request failed with status code 400'
				}], expect.anything())
				moxios.uninstall(vueAxios.Axios.Axios)
			})
			.catch(() => {
			})
	})

	it('Default handler is run on unhandled errors', () => {
		const errorMock = jest.fn()
		vueAxios.errorHandler = errorMock
		moxios.install(vueAxios.Axios.Axios)
		const errors = [
			{
				type: 'InputValidation',
				message: 'Some some some some'
			},
			{
				type: 'InputValidation',
				message: 'Some other error'
			}
		]
		moxios.stubOnce('get', '/url', {
			status: 200,
			response: JSON.stringify({
				errors
			})
		})
		return vue.$axios
			.get('/url')
			.finally(() => {
				expect(errorMock).toHaveBeenCalledWith(expect.arrayContaining(errors), expect.anything())
				moxios.uninstall(vueAxios.Axios.Axios)
			})
			.catch(() => {
			})
	})

})
