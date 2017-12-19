import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    pageId: 0, 
    lastLineCode: 0, 
    code: ''
}
  
export default new Vuex.Store({
    state,
    mutations: {
        changePage (state, newPage) {
            state.pageId = newPage
        },
        addCodeLine (state, newCodeLine) {
            state.code += newCodeLine + '\r\n'
        },
        cleanCodeLine (state){
            state.code = ''
        }
    }
})
  