const setTimeoutFunc = setTimeout

function noop() {
}

export default class ResponsePromise<T = any> implements Promise<T> {
	'constructor': typeof ResponsePromise
	readonly [Symbol.toStringTag]: 'Promise'
	static readonly [Symbol.toStringTag]: 'Promise'
	private _state = 0
	private _handled = false
	private _value: any = undefined
	private _deferreds: any = []

	constructor(resolver: (resolve: (value?: any | PromiseLike<any>) => void, reject: (reason?: any) => void) => void) {
		this.doResolve(resolver)
	}

	private doResolve(fn) {
		let done = false
		try {
			fn(
				value => {
					if (done) return
					done = true
					this.resolve(value)
				},
				reason => {
					if (done) return
					done = true
					this.reject(reason)
				}
			)
		} catch (exception) {
			if (done) return
			done = true
			this.reject(exception)
		}
	}

	private resolve(value) {
		try {
			if (value === self) {
				throw new TypeError('A promise cannot be resolved with itself')
			}
			if (value && (typeof value === 'object' || typeof value === 'function')) {
				const then = value.then
				if (value instanceof ResponsePromise) {
					this._state = 3
					this._value = value
					this.finale()
					return
				} else if (typeof then === 'function') {
					this.doResolve(() => {
						then.apply(value, arguments)
					})
					return
				}
			}
			this._state = 1
			this._value = value
			this.finale()
		} catch (exception) {
			this.reject(exception)
		}
	}

	private reject(reason) {
		this._state = 2
		this._value = reason
		this.finale()
	}

	private finale() {
		this._deferreds.forEach(deferred => {
			this.handle(deferred)
		})
		this._deferreds = null
	}

	private handle(deferred) {
		let self = this
		while (self._state === 3) {
			self = self._value
		}
		if (self._state === 0) {
			self._deferreds.push(deferred)
			return
		}
		self._handled = true
		ResponsePromise._immediateFn(() => {
			const cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected
			if (cb === null) {
				if (self._state === 1) {
					deferred.promise.resolve(self._value)
				} else {
					deferred.promise.reject(self._value)
				}
				return
			}
			let ret
			try {
				ret = cb(self._value)
				if (ret instanceof Promise) {
					ret = this.constructor.transform(ret)
				}
			} catch (exception) {
				deferred.promise.reject(exception)
				return
			}
			deferred.promise.resolve(ret)
		})
	}


	catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | null | undefined): ResponsePromise<any> {
		return this.then(null, onrejected)
	}

	finally<U>(onFinally?: () => (PromiseLike<U> | U)): ResponsePromise<any>
	finally(onFinally?: (() => void) | null | undefined): ResponsePromise<any>
	finally(onFinally?): Promise<any> {
		const constructor = this.constructor
		return this.then(
			value => constructor.resolve(onFinally()).then(() => value),
			reason => constructor.resolve(onFinally()).then(() => constructor.reject(reason))
		)
	}

	then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: any) => (PromiseLike<TResult1> | TResult1)) | null | undefined, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | null | undefined): ResponsePromise<TResult1 | TResult2> {
		const prom = new this.constructor(noop)

		this.handle(new Handler(onfulfilled, onrejected, prom))
		return prom
	}

	static resolve(value) {
		if (value && typeof value === 'object' && value.constructor === ResponsePromise) {
			return value
		}

		return new ResponsePromise(resolve => {
			resolve(value)
		})
	}

	static reject(value) {
		return new ResponsePromise((resolve, reject) => {
			reject(value)
		})
	}

	static transform<T = any>(value) : ResponsePromise<T> {
		if (value && typeof value === 'object' && value instanceof Promise) {
			return new ResponsePromise((resolve, reject) => {
				value.then(resolve, reject)
			})
		}
		throw new TypeError('Value is not of type promise')
	}

	static _immediateFn(fn) {
		if (typeof setImmediate === 'function') {
			setImmediate(fn)
		} else {
			setTimeoutFunc(fn, 0)
		}
	}
}

class Handler {
	onFulfilled: ((value: any) => (PromiseLike<any> | any)) | null | undefined
	onRejected: ((reason: any) => (PromiseLike<any> | any)) | null | undefined
	promise: ResponsePromise

	constructor(onFulfilled: ((value: any) => (PromiseLike<any> | any)) | null | undefined, onRejected: ((reason: any) => (PromiseLike<any> | any)) | null | undefined, promise: ResponsePromise) {
		this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
		this.onRejected = typeof onRejected === 'function' ? onRejected : null
		this.promise = promise
	}
}