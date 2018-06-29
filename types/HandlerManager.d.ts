export default class HandlerManager<T> {
	handlers: Array<T | null>

	use(onRejected: T): number;

	eject(id: any): void;

	forEach(fn: any): void;

	reduce(fn: any, initialValue: any): any;
}
