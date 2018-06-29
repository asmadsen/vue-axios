export default (Vue) => {
	Vue.mixin({
		beforeCreate() {
			const options = this.$options

			if (options.vueAxios) {
				options.vueAxios.init(Vue, options.store)
				this.$axios = options.vueAxios.Axios
			} else if (options.parent && options.parent.$axios) {
				this.$axios = options.parent.$axios
			}
		}
	})
}