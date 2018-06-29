import ResponsePromise from '../../src/ResponsePromise'

describe('Response promise', () => {
	it('should be able to use then to do assertions', () => {
		const promise = new ResponsePromise(resolve => resolve('resolvedValue'))
		return promise.then(value => {
			expect(value).toEqual('resolvedValue')
		})
	})

	it('should be able to use finally to do assertions', done => {
		const promise = new ResponsePromise(resolve => resolve())
		const test = 'someValue'
		promise.finally(() => {
			expect(test).toEqual('someValue')
			done()
		})
	})

	it('should run catch on rejected', () => {
		const rejected = jest.fn()
		const promise = new ResponsePromise((resolve, reject) => reject('rejectedValue'))
			.catch(rejected)
		return promise.finally(() => {
			expect(rejected).toHaveBeenCalledWith('rejectedValue')
		})
	})

	it('shouldn\'t throw error when not catching rejection', (done) => {
		const promise = new ResponsePromise((resolve, reject) => reject('rejectedValue'))
		promise.finally(() => {
			done()
		})
	})

	it('should get error if catch is run', (done) => {
		const rejected = jest.fn()
		const promise = new ResponsePromise((resolve, reject) => reject('rejectedValue'))
			.catch(rejected)
		promise.finally(() => {
			expect(rejected).toHaveBeenCalledWith('rejectedValue')
			done()
		})
	})
})