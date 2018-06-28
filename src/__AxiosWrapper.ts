import axios, {AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse} from 'axios'
import VueAxios from './index'
import {Store} from 'vuex'
import ResponsePromise from './ResponsePromise'

class AxiosWrapper {
	Axios: AxiosInstance
	VueAxios: VueAxios
	private requestInterceptorId: number | null = null
	private responseInterceptorId: number | null = null

	constructor(vueAxios: VueAxios, config: AxiosRequestConfig = {}) {
		this.Axios = axios.create(Object.assign({}, config))
		this.VueAxios = vueAxios
		this.registerInterceptors()
	}

	registerInterceptors() {
		this.unRegisterInterceptors()
		this.requestInterceptorId = this.Axios.interceptors.request
			.use(this.requestFulfilled, this.requestRejected)

		this.responseInterceptorId = this.Axios.interceptors.response
			.use(this.responseFulfilled, this.responseRejected)
	}

	unRegisterInterceptors() {
		if (this.requestInterceptorId !== null) {
			this.Axios.interceptors.request.eject(this.requestInterceptorId)
		}
		if (this.responseInterceptorId !== null) {
			this.Axios.interceptors.response.eject(this.responseInterceptorId)
		}
	}

	private requestFulfilled(config: AxiosRequestConfig): AxiosRequestConfig {
		return config
	}

	private requestRejected(error: any): any {
		return Promise.reject(error)
	}

	private responseFulfilled(response: AxiosResponse): AxiosResponse {
		return response
	}

	private responseRejected(error: any): any {
		return Promise.reject(error)
	}

	get store(): Store<any> | undefined {
		return this.VueAxios.store
	}

	private get chain() {
		return new AxiosRequestChain(this.Axios, this.VueAxios)
	}

	handle(handler: (errors: Array<any>) => any, errorType?: string) {
		return this.chain.handle(handler, errorType)
	}

	handleFirst(handler: (error: any) => any, errorType?: string) {
		return this.chain.handleFirst(handler, errorType)
	}

	get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
		return this.chain.get(url, config)
	}

	patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
		return this.chain.patch(url, data, config)
	}

	put<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise<T> {
		return this.chain.put(url, data, config)
	}

	post<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise<T> {
		return this.chain.post(url, data, config)
	}

	head(url: string, config?: AxiosRequestConfig | undefined): AxiosPromise<any> {
		return this.chain.head(url, config)
	}

	delete(url: string, config?: AxiosRequestConfig | undefined): AxiosPromise<any> {
		return this.chain.delete(url, config)
	}

	request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
		return this.chain.request(config)
	}
}

declare interface RequestOptions {
	errorHandlers: Array<ErrorsHandler | ErrorHandler>
}

declare interface ErrorHandler {
	type: 'generic' | string
	first: true,
	handler: (error: any) => any
}

declare interface ErrorsHandler {
	type: 'generic' | string
	first: false,
	handler: (errors: Array<any>) => any
}


export class AxiosRequestChain {
	private axios: AxiosInstance
	private VueAxios: VueAxios
	private requestOptions: RequestOptions = {
		errorHandlers: []
	}

	constructor(axios: AxiosInstance, vueAxios: VueAxios) {
		this.axios = axios
		this.VueAxios = vueAxios
	}

	handle(handler: (errors: Array<any>) => any, errorType?: string) {
		this.requestOptions.errorHandlers.push(<ErrorsHandler>{
			type: errorType || 'generic',
			first: false,
			handler: handler
		})
		return this
	}

	handleFirst(handler: (error: any) => any, errorType?: string) {
		this.requestOptions.errorHandlers.push(<ErrorHandler>{
			type: errorType || 'generic',
			first: true,
			handler: handler
		})
		return this
	}

	get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
		return this.request({
			...config,
			method: 'get',
			url,
		})
	}

	patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise<T> {
		return this.request({
			...config,
			method: 'patch',
			url,
			data
		})
	}

	put<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise<T> {
		return this.request({
			...config,
			method: 'put',
			url,
			data
		})
	}

	post<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise<T> {
		return this.request({
			...config,
			method: 'post',
			url,
			data
		})
	}

	head(url: string, config?: AxiosRequestConfig | undefined): AxiosPromise<any> {
		return this.request({
			...config,
			method: 'head',
			url
		})
	}

	delete(url: string, config?: AxiosRequestConfig | undefined): AxiosPromise<any> {
		return this.request({
			...config,
			method: 'delete',
			url
		})
	}

	request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
		return ResponsePromise
			.transform(
				this.axios.request({
					...config
				})
			)
			.then(response => {
				const errors = [
					...(response.data && response.data.errors || []),
					...([(response.data && response.data.error || null)].filter(e => e !== null))
				]
				if (errors && errors.length > 0) {
					return new Promise((resolve, reject) => {
						reject(<AxiosError>{
							config: response.config,
							request: response.request,
							response
						})
					})
				}
				return response
			})
			.catch((error): any => {
				let errors = [
					...(error.response.data && error.response.data.errors || []),
					...([(error.response.data && error.response.data.error || null)].filter(e => e !== null))
				]
				if (errors.length > 0) {
					this.requestOptions.errorHandlers.map(options => {
						let filteredErrors = [...errors]
						if (options.type !== 'generic' && options.type !== null && options.type !== undefined) {
							filteredErrors = filteredErrors.filter(error => error.type === options.type)
						}
						try {
							let potentialPromise
							if (options.first) {
								filteredErrors = [filteredErrors[0]]
								potentialPromise = options.handler(filteredErrors[0])
							} else {
								potentialPromise = options.handler(filteredErrors)
							}
							if (potentialPromise instanceof Promise) {
								potentialPromise.catch(errors => {
									throw errors
								})
							}
							errors = [
								...(errors.filter(error => filteredErrors.indexOf(error) === -1)),
							]
						} catch (unhandledErrors) {
							console.log(unhandledErrors)
							if (unhandledErrors instanceof Array !== true) {
								unhandledErrors = [unhandledErrors]
							}
							errors = [
								...unhandledErrors,
								...(errors.filter(error => filteredErrors.indexOf(error) === -1)),
							]
						}
					})
				}
				if (errors.length > 0) {
					this.VueAxios.errorHandler(errors, error)
				}
				return Promise.reject(error)
			})
	}
}

export default AxiosWrapper