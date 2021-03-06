import {AxiosRequestConfig} from 'axios'

declare module 'axios/index' {
	interface AxiosRequestConfig {
		authenticate?: boolean | null | undefined,
		authenticateDomains?: Array<string> | null | undefined
	}
}