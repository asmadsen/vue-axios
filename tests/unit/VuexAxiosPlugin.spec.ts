import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueAxios from '@/index'

describe('Vuex Axios Plugin', () => {
	let vue
	let store

	beforeEach(() => {
		VueAxios.resetInstance()
		const Vue = createLocalVue()
		Vue.use(Vuex)
		store = new Vuex.Store({
		})
		Vue.use(VueAxios)
		vue = new Vue({
			store,
			axios: VueAxios.instance
		})
	})

	it('Module functionality works', () => {
		expect(store.state.authentication.accessToken).toBeNull()
		expect(store.getters.hasAccessToken).toEqual(false)
		store.commit('setAccessToken', 'some token')
		expect(store.getters.hasAccessToken).toEqual(true)
		expect(store.state.authentication.refreshToken).toBeNull()
		expect(store.getters.hasRefreshToken).toEqual(false)
		store.commit('setRefreshToken', 'some token')
		expect(store.getters.hasRefreshToken).toEqual(true)
	})

})
