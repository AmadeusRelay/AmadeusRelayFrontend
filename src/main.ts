// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueResource)
Vue.use(Vuex);

const state = {
  pageId: 0
}

const store = new Vuex.Store({
  state,
  mutations: {
    changePage (state, newPage) {
      state.pageId = newPage
    }
  }
})

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  store
})