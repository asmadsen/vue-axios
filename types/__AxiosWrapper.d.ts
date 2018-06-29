import {AxiosInstance, AxiosPromise, AxiosRequestConfig} from 'axios'
import VueAxios from './index'
import {Store} from 'vuex'

declare class __AxiosWrapper {
	Axios: AxiosInstance
	VueAxios: VueAxios
	private requestInterceptorId
	private responseInterceptorId

	constructor(vueAxios: VueAxios, config?: AxiosRequestConfig);

	registerInterceptors(): void;

	unRegisterInterceptors(): void;

	private requestFulfilled
	private requestRejected
	private responseFulfilled
	private responseRejected
	readonly store: Store<any> | undefined
	private readonly chain

	handle(handler: (errors: Array<any>) => any, errorType?: string): AxiosRequestChain;

	handleFirst(handler: (error: any) => any, errorType?: string): AxiosRequestChain;

	get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

	patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;

	put<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise<T>;

	post<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise<T>;

	head(url: string, config?: AxiosRequestConfig | undefined): AxiosPromise<any>;

	delete(url: string, config?: AxiosRequestConfig | undefined): AxiosPromise<any>;

	request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
}

export declare class AxiosRequestChain {
	private axios
	private VueAxios
	private requestOptions

	constructor(axios: AxiosInstance, vueAxios: VueAxios);

	handle(handler: (errors: Array<any>) => any, errorType?: string): this;

	handleFirst(handler: (error: any) => any, errorType?: string): this;

	get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

	patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise<T>;

	put<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise<T>;

	post<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise<T>;

	head(url: string, config?: AxiosRequestConfig | undefined): AxiosPromise<any>;

	delete(url: string, config?: AxiosRequestConfig | undefined): AxiosPromise<any>;

	request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
}

export default __AxiosWrapper
