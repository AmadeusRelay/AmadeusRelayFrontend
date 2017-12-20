import Vue from 'vue'
import Vuex from 'vuex'
import { TokenPair } from "../model/tokenPair";

Vue.use(Vuex)

const state = {
    pageId: 0, 
    lastLineCode: 0, 
    code: '',
    tokenPairs: []
}
  
export default new Vuex.Store({
    state,
    mutations: {
        changePage (state, newPage : number) {
            state.pageId = newPage
        },
        addCodeLine (state, newCodeLine: string) {
            state.code += newCodeLine + '\r\n'
        },
        updateTokenPairs (state, tokenPairs : TokenPair[]) {
            state.tokenPairs = tokenPairs
        },
        cleanCodeLine (state) {
            state.code = ''
        }
    },
    getters: {
        getTokenPairs () : TokenPair[] {
            return state.tokenPairs
        }
    }
})
  