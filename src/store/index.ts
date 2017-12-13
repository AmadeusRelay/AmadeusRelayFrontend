import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    pageId: 0, 
    codeLines: [],
    lastLineCode: 0
}
  
export default new Vuex.Store({
    state,
    mutations: {
        changePage (state, newPage) {
            state.pageId = newPage
        },
        inicializeCodeLines (state, totalLines) {
            for (var i = 0; i < totalLines; i++){
                state.codeLines.push('')
            }
        },
        addCodeLine (state, newCodeLine) {
            if(newCodeLine){
                state.codeLines[state.lastLineCode] = newCodeLine
                state.lastLineCode++
            }
        }
    }
})
  