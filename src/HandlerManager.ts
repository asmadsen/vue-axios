export default class HandlerManager<T> {
	handlers: Array<T | null> = []

	use(onRejected: T) {
		this.handlers.push(onRejected)
		return this.handlers.length - 1
	}

	eject(id) {
		if (this.handlers[id]) {
			this.handlers[id] = null
		}
	}

	forEach(fn) {
		this.handlers.forEach(handler => {
			if (handler !== null) {
				fn(handler)
			}
		})
	}

	reduce(fn, initialValue) {
		return this.handlers.reduce((value, handler) => {
			if (handler !== null) {
				return fn(value, handler)
			}
			return value
		}, initialValue)
	}
}