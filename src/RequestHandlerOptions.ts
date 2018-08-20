import {AxiosError, AxiosPromise, AxiosRequestConfig} from 'axios'
import Request from './Request'
import ResponsePromise from './ResponsePromise'

export declare interface ErrorHandler {
	type: 'generic' | string
	first: true,
	handler: (errors: Array<any>, context: AxiosError) => Promise<any> | any | void
}

export declare interface ErrorsHandler {
	type: 'generic' | string
	first: false,
	handler: (error: any, context: AxiosError) => Promise<any> | any | void
}

export default class RequestHandlerOptions<T = any> extends Request<T> {
	protected handlers: Array<ErrorHandler | ErrorsHandler> = []

	request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
		return new ResponsePromise<T>((resolve, reject) => {
			super.request(config)
				.then(
					response => {
						const errors = this.gatherErrors({response})
						if (errors.length > 0) {
							reject({response, ...response})
							return
						}
						resolve(response)
						return
					})
				.catch(reason => {
					reject(reason)
				})
		})
			.catch(
				error => {
					const errors = this.gatherErrors(error)
					if (errors.length > 0) {
						return this.runHandlers(errors, error)
							.then(() => {
								return Promise.reject(error)
							})
					}
					return Promise.reject(error)
				})
	}

	private gatherErrors(error) {
		let responseErrors: Array<any> = []

		if (error.response && error.response.data) {
			responseErrors = [
				...(error.response.data.errors || []),
				...(error.response.data.error ? [error.response.data.error] : [])
			]
		} else if (error instanceof Error) {
			const {message} = error
			responseErrors = [
				{
					type: 'HttpStatus',
					message
				}
			]
		}

		return [
			...responseErrors
		]
	}

	handle(handler: (errors: Array<any>, context: AxiosError) => Promise<any> | any | void, errorType?: string): RequestHandlerOptions {
		this.handlers.push(<ErrorsHandler>{
			type: errorType || 'generic',
			first: false,
			handler
		})
		return this
	}

	handleFirst(handler: (error: any, context: AxiosError) => Promise<any> | any | void, errorType?: string): RequestHandlerOptions {
		this.handlers.push(<ErrorHandler>{
			type: errorType || 'generic',
			first: true,
			handler
		})
		return this
	}

	runHandlers(errors: Array<any>, context: AxiosError) {
		let prom: Promise<any> = Promise.reject(errors)

		this.handlers.forEach(handler => {
			prom = this.runHandler(handler, prom, context)
		})

		return prom.then(() => {
		}, errors => {
			if (errors) {
				this.VueAxios.errorHandler.forEach(handler => {
					handler(errors, context)
				})
			}
		})
	}

	private runHandler({type, first, handler}, errors: Promise<any>, context: AxiosError): Promise<any> {
		return errors
			.catch(errors => {
				let filteredErrors: Array<any> = errors
					.filter(error => type === 'generic' || type === error.type)

				filteredErrors = first ? [filteredErrors[0]] : filteredErrors

				const remainingErrors = errors
					.filter(error => filteredErrors.indexOf(error) === -1)

				try {
					const result = handler(first ? filteredErrors[0] : filteredErrors, context)

					if (result instanceof Promise) {
						return result
							.then(
								() => {
									return Promise.reject([
										...remainingErrors
									])
								},
								rejectedErrors => {
									rejectedErrors = rejectedErrors instanceof Array ? rejectedErrors : [rejectedErrors]

									return Promise.reject([
										...remainingErrors,
										...rejectedErrors
									])
								})
					}

					return Promise.reject([
						...remainingErrors
					])
				} catch (thrownErrors) {
					thrownErrors = thrownErrors instanceof Array ? thrownErrors : [thrownErrors]
					return Promise.reject([
						...thrownErrors,
						...remainingErrors
					])
				}
			})
	}
}