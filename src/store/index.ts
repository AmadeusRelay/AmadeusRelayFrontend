import Vue from 'vue'
import Vuex from 'vuex'
import { TokenPair } from "../model/tokenPair";
import { Order } from '../model/order'
import { BigNumber } from 'bignumber.js'

Vue.use(Vuex)

const state = {
    pageId: 0,
    strategyId: 0, 
    lastLineCode: 0, 
    code: '',
    tokenPairs: [],
    orders: [],
    selectedOrder: null,
    signedOrder: null,
    takerAmount: null,
    errorMessage: null,
    loading: false
}
  
export default new Vuex.Store({
    state,
    mutations: {
        changePage (state, newPage : number) {
            state.pageId = newPage
        },
        chooseStrategy (state, strategy: number) {
            state.strategyId = strategy
        },
        addCodeLine (state, newCodeLine: string) {
            state.code += newCodeLine + '\r\n'
        },
        updateTokenPairs (state, tokenPairs : TokenPair[]) {
            state.tokenPairs = tokenPairs
        },
        updateOrders (state, orders : Order[]) {
            state.orders = orders
        },
        selectOrder (state, order : Order) {
            state.selectedOrder = order
        },
        updateTakerAmount(state, takerAmount: BigNumber) {
            state.takerAmount = takerAmount
        },
        cleanCodeLine (state) {
            state.code = ''
        },
        updateErrorMessage(state, errorMessage: string) {
            state.errorMessage = errorMessage;
        },
        updateLoadingState(state, loading: boolean){
            state.loading = loading
        }
    },
    getters: {
        getTokenPairs () : TokenPair[] {
            return state.tokenPairs
        },
        getOrders () : Order[] {
            return state.orders
        },
        getSelectedOrder () : Order {
            return state.selectedOrder
        },
        getTakerAmount () : BigNumber {
            return state.takerAmount
        },
        getErrorMessage () : string {
            return state.errorMessage;
        }
    }
})
  