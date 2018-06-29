import VueAxios from './index'
import {Store} from 'vuex'
import {AxiosError, AxiosRequestConfig} from 'axios'
import RequestHandlerOptions from './RequestHandlerOptions'

export default class VueAxiosInterface extends RequestHandlerOptions {
	constructor(vueAxios: VueAxios, config?: AxiosRequestConfig);

	readonly store: Store<any>
	readonly axios: this

	handle(handler: (errors: Array<any>, context: AxiosError) => Promise<any> | any | void, errorType?: string): RequestHandlerOptions;

	handleFirst(handler: (error: any, context: AxiosError) => Promise<any> | any | void, errorType?: string): RequestHandlerOptions;
}
