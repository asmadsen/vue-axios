import {createLocalVue} from '@vue/test-utils'
import VueAxios from '../../src'
import moxios from 'moxios'

describe('Error handler hook', () => {
	let Vue
	let vue
	let vueAxios

	beforeEach(() => {
		Vue = createLocalVue()
		Vue.use(VueAxios)
		vueAxios = new VueAxios()
		moxios.install(vueAxios.Axios.Axios)
		vue = new Vue({
			vueAxios
		})
	})

	afterEach(() => {
		moxios.uninstall(vueAxios.Axios.Axios)
	})

	it('should register error handler', () => {
		const mock = jest.fn()
		vueAxios.errorHandler.use(mock)

		return vueAxios.initialized.then(() => {
			moxios.stubOnce('get', '/', {
				status: 400,
				response: {
					errors: [
						{
							type: '',
							message: 'some error'
						}
					]
				}
			})

			return vue.$axios.get('/')
				.catch(() => {
				})
				.finally(() => {
					expect(mock).toHaveBeenCalled()
				})
		})
	})

	it('should only be run with unhandled errors', () => {
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
		const errorHandlerMock = jest.fn()
		vueAxios.errorHandler.use(errorHandlerMock)
		const mock = jest.fn(errors => {
			throw errors
		})
		const mock2 = jest.fn()
		return vue.$axios
			.handle(mock)
			.handle(mock2, 'AuthenticationError')
			.get('/url')
			.catch(() => {
			})
			.finally(() => {
				expect(errorHandlerMock).toHaveBeenCalledWith(expect.arrayContaining([
					{
						type: 'InputValidation',
						message: 'Some some some some'
					},
					{
						type: 'InputValidation',
						message: 'Some other error'
					}
				]), expect.anything())
			})
	})
})