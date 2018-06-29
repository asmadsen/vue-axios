import {AxiosError, AxiosPromise, AxiosRequestConfig} from 'axios'
import Request from './Request'

export declare interface ErrorHandler {
	type: 'generic' | string;
	first: true;
	handler: (errors: Array<any>, context: AxiosError) => Promise<any> | any | void;
}

export declare interface ErrorsHandler {
	type: 'generic' | string;
	first: false;
	handler: (error: any, context: AxiosError) => Promise<any> | any | void;
}

export default class RequestHandlerOptions extends Request {
	protected handlers: Array<ErrorHandler | ErrorsHandler>

	request<T>(config: AxiosRequestConfig): AxiosPromise<T>;

	private gatherErrors

	handle(handler: (errors: Array<any>, context: AxiosError) => Promise<any> | any | void, errorType?: string): RequestHandlerOptions;

	handleFirst(handler: (error: any, context: AxiosError) => Promise<any> | any | void, errorType?: string): RequestHandlerOptions;

	runHandlers(errors: Array<any>, context: AxiosError): Promise<void>;

	private runHandler
}
