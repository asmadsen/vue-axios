export default class ResponsePromise implements Promise<any> {
	'constructor': typeof ResponsePromise
	readonly [Symbol.toStringTag]: 'Promise'
	static readonly [Symbol.toStringTag]: 'Promise'
	private _state
	private _handled
	private _value
	private _deferreds

	constructor(resolver: (resolve: (value?: any | PromiseLike<any>) => void, reject: (reason?: any) => void) => void);

	private doResolve
	private resolve
	private reject
	private finale
	private handle

	catch<TResult>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | null | undefined): Promise<any>;

	finally<U>(onFinally?: () => (PromiseLike<U> | U)): Promise<any>;
	finally(onFinally?: (() => void) | null | undefined): Promise<any>;

	then<TResult1, TResult2>(onfulfilled?: ((value: any) => (PromiseLike<TResult1> | TResult1)) | null | undefined, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | null | undefined): Promise<TResult1 | TResult2>;

	static resolve(value: any): any;

	static reject(value: any): ResponsePromise;

	static transform(value: any): ResponsePromise;

	static _immediateFn(fn: any): void;
}
