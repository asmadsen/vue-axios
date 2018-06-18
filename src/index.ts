import {CreateElement, Vue, VueConstructor} from 'vue/types/vue'
import AxiosWrapper from '@/AxiosWrapper'
import VuexAxiosPlugin from '@/VuexAxiosPlugin'
import {Store} from 'vuex'
import {
	ComponentOptions,
	DefaultComputed,
	DefaultData,
	DefaultMethods,
	DefaultProps,
	PropsDefinition,
} from 'vue/types/options'

declare module 'vue/types/vue' {
	interface Vue {
		$axios: any,
		__$axiosInstance: any
	}
}

declare module 'vue/types/options' {
	interface ComponentOptions<V extends Vue,
		Data=DefaultData<V>,
		Methods=DefaultMethods<V>,
		Computed=DefaultComputed,
		PropsDef=PropsDefinition<DefaultProps>,
		Props=DefaultProps> {
		axios?: VueAxios
	}
}

class VueAxios {
	private static _instance: VueAxios
	VuexPlugin: VuexAxiosPlugin
	Axios: AxiosWrapper
	store: Store<any> | undefined
	initialized: Promise<any>
	private initializedResolve: (() => void) = () => undefined
	private initializedReject: ((error?: any) => void) = () => undefined
	private _errorHandler: (unhandledErrors?: Array<any>, context?: any) => void = () => {
	}

	private static installed = false

	constructor() {
		this.initialized = new Promise<any>((resolve, reject) => {
			this.initializedResolve = resolve
			this.initializedReject = reject
		})
		this.VuexPlugin = new VuexAxiosPlugin()
		this.Axios = new AxiosWrapper(this)
	}

	static get instance() {
		if (!this._instance) {
			this._instance = new this
		}
		return this._instance
	}

	static resetInstance() {
		this._instance = new this
	}

	private initializeVuex(store: Store<any>) {
		this.VuexPlugin.install(store)
	}

	init(Vue, store) {
		Vue.prototype.$axios = this.Axios
		if (store) {
			this.store = store
			this.initializeVuex(store)
			this.initializedResolve()
		} else {
			this.initializedReject('Couldn\'t find $store on Vue prototype within 1000 ms, Vuex should be instantiated')
		}
	}

	static install(Vue: VueConstructor, options: any) {
		if (this.installed && Vue) {
			return
		}
		Vue.mixin({
			beforeCreate() {
				const {axios, store, parent} = this.$options

				let instance: VueAxios | null = null


				if (axios) {
					instance = axios
				} else if (parent) {
					instance = parent.__$axiosInstance
				}

				if (instance) {
					if (axios) {
						instance.init(Vue, store)
					} else if (parent) {
						instance.init(Vue, parent.$store)
					}

					this.__$axiosInstance = instance
				}
			}
		})
		this.installed = true
	}

	defaults = {
		errorHandler: {
			use: (handler: (unhandledErrors?: Array<any>, context?: any) => void) => {
				this._errorHandler = handler
			}
		}
	}

	errorHandler(unhandledErrors, context) {
		this._errorHandler(unhandledErrors, context)
	}
}

export default VueAxios