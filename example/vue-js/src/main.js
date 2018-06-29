import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueAxios from '@asmadsen/vue-axios'

Vue.use(VueAxios)
Vue.config.productionTip = false

new Vue({
	store,
	axios: new VueAxios(),
	render: h => h(App)
}).$mount('#app')
