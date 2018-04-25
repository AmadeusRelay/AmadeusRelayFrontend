import Vue from 'vue'
import Vuex from 'vuex'
import { TokenPair } from "../model/tokenPair";
import { Order } from '../model/order'
import { TokenInfo } from '../model/tokeninfo'
import { BigNumber } from 'bignumber.js'
import { SignedOrder } from '@0xproject/connect';

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
    tokenSoldAmount: null,
    errorMessage: null,
    loading: false,
    tokenSold: null,
    tokenBought: null,
    feeToPay: null,
    needBalance: false,
    needToSetFeeAllowance: false,
    needToSetAllowance: false,
    needToWrapEth: false,
    needFeeBalance: false
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
        updateTokenSoldAmount(state, tokenSoldAmount: BigNumber) {
            state.tokenSoldAmount = tokenSoldAmount
        },
        cleanCodeLine (state) {
            state.code = ''
        },
        updateErrorMessage(state, errorMessage: string) {
            state.errorMessage = errorMessage;
        },
        updateLoadingState(state, loading: boolean){
            state.loading = loading
        },
        updateSignOrder(state, signedOrder: SignedOrder){
            state.signedOrder = signedOrder
        },
        updateTokenSold(state, tokenSold: TokenInfo){
            state.tokenSold = tokenSold
        },
        updateTokenBought(state, tokenBought: TokenInfo){
            state.tokenBought = tokenBought
        },
        updateFeeToPay(state, feeToPay: BigNumber){
            state.feeToPay = feeToPay
        },
        updateNeedBalance (state, needBalance: boolean){
            state.needBalance = needBalance
        },
        updateNeedFeeBalance (state, needFeeBalance: boolean){
            state.needFeeBalance = needFeeBalance
        },
        updateNeedToSetFeeAllowance (state, needToSetFeeAllowance: boolean){
            state.needToSetFeeAllowance = needToSetFeeAllowance
        },
        updateNeedToSetAllowance (state, needToSetAllowance: boolean){
            state.needToSetAllowance = needToSetAllowance
        },
        updateNeedToWrapEth (state, needToWrapEth: boolean){
            state.needToWrapEth = needToWrapEth
        },
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
        getSignedOrder () : SignedOrder {
            return state.signedOrder
        },
        getTokenSoldAmount () : BigNumber {
            return state.tokenSoldAmount
        },
        getTokenSold () : TokenInfo {
            return state.tokenSold
        },
        getTokenBought () : TokenInfo {
            return state.tokenBought
        },
        getFeeToPay () : TokenInfo {
            return state.feeToPay
        },
        getErrorMessage () : string {
            return state.errorMessage;
        },
        getNeedBalance () : boolean {
            return state.needBalance;
        },
        getNeedFeeBalance () : boolean {
            return state.needFeeBalance;
        },
        getNeedToSetFeeAllowance () : boolean {
            return state.needToSetFeeAllowance;
        },
        getNeedToSetAllowance () : boolean {
            return state.needToSetAllowance;
        },
        getNeedToWrapEth () : boolean {
            return state.needToWrapEth;
        }
    }
})
  