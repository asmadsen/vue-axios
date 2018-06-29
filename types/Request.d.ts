import VueAxios from './index'
import {AxiosInstance, AxiosPromise, AxiosRequestConfig} from 'axios'

export default class Request {
	'constructor': typeof Request
	protected Axios: AxiosInstance
	protected VueAxios: VueAxios
	config: AxiosRequestConfig

	constructor(axios: AxiosInstance, vueAxios: VueAxios, config?: AxiosRequestConfig);

	unauthenticate(): this;

	authenticate(): this;

	private shouldAuthenticate

	request<T = any>(_config: AxiosRequestConfig): AxiosPromise<T>;

	delete(url: string, config?: AxiosRequestConfig): AxiosPromise;

	get<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

	head(url: string, config?: AxiosRequestConfig): AxiosPromise;

	patch<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;

	post<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;

	put<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
}
