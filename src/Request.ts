import VueAxios from './index'
import {AxiosInstance, AxiosPromise, AxiosRequestConfig} from 'axios'
import ResponsePromise from './ResponsePromise'
import axios from 'axios'

const isAbsoluteURL = require('axios/lib/helpers/isAbsoluteURL.js')

export default class Request<T = any> {
	'constructor': typeof Request
	protected Axios: AxiosInstance
	protected VueAxios: VueAxios
	config: AxiosRequestConfig = {}

	constructor(axios: AxiosInstance, vueAxios: VueAxios, config: AxiosRequestConfig = {}) {
		this.Axios = axios
		this.VueAxios = vueAxios
		this.config = {...config}
	}

	unauthenticate() {
		const instance = this.newInstance()
		instance.config.authenticate = false
		return instance
	}

	authenticate() {
		const instance = this.newInstance()
		instance.config.authenticate = true
		return instance
	}

	private newInstance() {
		return new this.constructor(this.Axios, this.VueAxios, this.config)
	}

	private shouldAuthenticate(config) {
		if (config.auth) {
			return false
		}
		if (typeof this.config.authenticate === 'boolean') {
			return this.config.authenticate
		}
		if (Array.isArray(config.authenticateDomains) && config.authenticateDomains.length > 0) {
			return config.authenticateDomains.filter(value => new RegExp(`${value}`).test(config.url)).length > 0
		}
		return false
	}

	request<T = any>(_config: AxiosRequestConfig): AxiosPromise<T> {
		if (this.constructor !== Request) {
			return (new Request(this.Axios, this.VueAxios, this.config))
				.request(_config)
		}

		let config: AxiosRequestConfig | Promise<AxiosRequestConfig> = {...this.config, ..._config}

		if (!isAbsoluteURL(config.url) && !!config.baseURL) {
			config.url = config.url
				? config.baseURL.replace(/\/+$/, '') + '/' + config.url.replace(/^\/+/, '')
				: config.baseURL
		}

		if (this.shouldAuthenticate(config)) {
			config = this.VueAxios.authentication.reduce((config, handler) => {
				return config instanceof Promise
					? config.then(config => handler(config, this.VueAxios.Axios))
					: handler(config, this.VueAxios.Axios)
			}, config)
		}

		if (config instanceof Promise) {
			return ResponsePromise.transform<T>(
				config.then(config => this.Axios(config))
			)
		} else {
			return ResponsePromise.transform<T>(this.Axios(config))
		}
	}

	delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
		return this.request({
			method: 'delete',
			url,
			...config
		})
	}

	get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
		return this.request({
			method: 'get',
			url,
			...config
		})
	}

	head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
		return this.request({
			method: 'head',
			url,
			...config
		})
	}

	patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
		return this.request({
			method: 'patch',
			url,
			data,
			...config
		})
	}

	post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
		return this.request({
			method: 'post',
			url,
			data,
			...config
		})
	}

	put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
		return this.request({
			method: 'put',
			url,
			data,
			...config
		})
	}
}
