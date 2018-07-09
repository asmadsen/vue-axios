import {Store} from 'vuex'
import VueAxiosInterface from './VueAxiosInterface'
import Mixin from './Mixin'
import {AxiosRequestConfig} from 'axios'
import axios from 'axios'
import HandlerManager from './HandlerManager'

import './vue'
import './axios'

export default class VueAxios {
	Axios: VueAxiosInterface<any>
	store: Store<any> | undefined
	initialized: Promise<any>
	private initializedResolve: (() => void) = () => undefined
	private initializedReject: ((error?: any) => void) = () => undefined
	errorHandler: HandlerManager<(unhandledErrors?: Array<any>, context?: any) => void> = new HandlerManager()
	authentication: HandlerManager<(request: AxiosRequestConfig, context?: any) => AxiosRequestConfig | Promise<AxiosRequestConfig>> = new HandlerManager()

	private static installed = false
	private _initialized = false

	constructor(config: AxiosRequestConfig = {}) {
		this.initialized = new Promise<any>((resolve, reject) => {
			this.initializedResolve = resolve
			this.initializedReject = reject
		})
		this.Axios = new VueAxiosInterface(axios.create({...config}), this, {...config})
	}

	init(Vue, store) {
		if (this._initialized) {
			return
		}
		Vue.prototype.$axios = this.Axios
		if (store) {
			this.store = store
		}
		this.initializedResolve()
		this._initialized = true
	}

	static install = Mixin
}