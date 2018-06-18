import {Store} from 'vuex'

class VuexAxiosPlugin {
	private store : Store<any> | undefined

	constructor() {
	}

	install(store : Store<any>) {
		if (store !== undefined) {
			store.registerModule('authentication', {
				state: {
					accessToken: <string | null> null,
					refreshToken: <string | null> null,
				},
				actions: {},
				mutations: {
					setAccessToken(state, token) {
						state.accessToken = token
					},
					setRefreshToken(state, token) {
						state.refreshToken = token
					}
				},
				getters: {
					hasAccessToken(state) {
						return state.accessToken !== null
					},
					hasRefreshToken(state) {
						return state.refreshToken !== null
					}
				}
			}, {
				preserveState: !!store.state.authentication
			})
		}
	}
}

export default VuexAxiosPlugin