import {Vue} from 'vue/types/vue'
import VueAxios from './index'

declare module 'vue/types/vue' {
	interface Vue {
		$axios: any,
		__$vueAxiosInstance: any
	}
}

declare module 'vue/types/options' {

	interface ComponentOptions<V extends Vue,
		Data,
		Methods,
		Computed,
		PropsDef,
		Props> {
		vueAxios?: VueAxios
	}
}