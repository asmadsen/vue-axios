import VueAxios from './index'
import {Store} from 'vuex'
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios'
import RequestHandlerOptions from './RequestHandlerOptions'

export default class VueAxiosInterface<T = any> extends RequestHandlerOptions<T> {
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