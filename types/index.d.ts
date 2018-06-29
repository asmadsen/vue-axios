import {Store} from 'vuex'
import VueAxiosInterface from './VueAxiosInterface'
import {AxiosRequestConfig} from 'axios'
import HandlerManager from './HandlerManager'
import './vue'
import './axios'

export default class VueAxios {
	Axios: VueAxiosInterface
	store: Store<any> | undefined
	initialized: Promise<any>
	private initializedResolve
	private initializedReject
	errorHandler: HandlerManager<(unhandledErrors?: Array<any>, context?: any) => void>
	authentication: HandlerManager<(request: AxiosRequestConfig, context?: any) => AxiosRequestConfig | Promise<AxiosRequestConfig>>
	private static installed
	private _initialized

	constructor(config?: AxiosRequestConfig);

	init(Vue: any, store: any): void;

	static install: (Vue: any) => void
}
