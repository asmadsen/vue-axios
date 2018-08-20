import RequestHandlerOptions from '../../src/RequestHandlerOptions'
import Axios from 'axios'
import VueAxios from '../../src/index'

describe('Request handler options', () => {
	it('should have handler function', () => {
		const requestHandlerOptions = new RequestHandlerOptions(Axios.create(), new VueAxios())
		expect(typeof requestHandlerOptions.handle).toEqual('function')
		expect(typeof requestHandlerOptions.handleFirst).toEqual('function')
	})

	it('should register and run handlers', () => {
		const requestHandlerOptions = new RequestHandlerOptions(Axios.create(), new VueAxios())

		const mockHandleFirst = jest.fn(error => {
			return Promise.reject(error)
		})

		const mockHandleReject = jest.fn(errors => {
			return Promise.reject(errors[2])
		})

		const second = jest.fn()

		requestHandlerOptions.handleFirst(mockHandleFirst, 'AuthenticationError')
			.handle(mockHandleReject)
			.handle(second)

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

		const context = {message: '', name: '', config: {}}

		return requestHandlerOptions.runHandlers(errors, context).finally(() => {
			expect(mockHandleFirst).toHaveBeenCalledWith(errors[2], context)
			expect(second).toHaveBeenCalledWith([errors[2]], context)
		})
	})
})