import VueAxios from './index'
import {Store} from 'vuex'
import axios, {AxiosError, AxiosRequestConfig} from 'axios'
import RequestHandlerOptions from './RequestHandlerOptions'

export default class VueAxiosInterface extends RequestHandlerOptions {
	constructor(vueAxios: VueAxios, config: AxiosRequestConfig = {}) {
		const Axios = axios.create(Object.assign({}, config))
		super(Axios, vueAxios, config)
	}

	get store(): Store<any> {
		return <Store<any>> this.VueAxios.store
	}

	get axios() {
		return this
	}

	//defaults: AxiosRequestConfig
	//interceptors: { request: AxiosInterceptorManager<AxiosRequestConfig>; response: AxiosInterceptorManager<AxiosResponse> }

	handle(handler: (errors: Array<any>, context: AxiosError) => Promise<any> | any | void, errorType?: string) {
		return (new RequestHandlerOptions(this.Axios, this.VueAxios))
			.handle(handler, errorType)
	}

	handleFirst(handler: (error: any, context: AxiosError) => Promise<any> | any | void, errorType?: string) {
		return (new RequestHandlerOptions(this.Axios, this.VueAxios))
			.handleFirst(handler, errorType)
	}
}