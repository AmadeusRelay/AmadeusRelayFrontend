<template>
<div id="post-fee-section">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <p>The DApps needs to choose the token and the amount it wants to sell as well as the token to buy. We will return the maximum amount we are willing to sell.</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <label>Maker token (to sell)</label>
                <tokens-list :token='makerToken' ref='makerTokenRef' @updateToken='updateMakerToken'/> 
            </div>
            <div class="col-md-2">
                <label>Maker Amount</label>
                <input v-model="makerAmount" class="form-control" /> 
                <p v-if="error" class="error">{{error}}</p>
            </div>
            <div class="col-md-4">
                <label>Taker token (to buy)</label>
                <tokens-list :token='takerToken' ref="takerTokenRef" @updateToken='updateTakerToken'/>
            </div>
            <div class="col-md-2">
                <label>Max Amount</label>
                <input class="form-control" v-model="maxAmount" disabled/> 
            </div>
        </div> 
        <div class="row">
            <div class="col-md-4">
                <label>Expiration date</label>
                <datetime v-model="date" type="datetime" input-class="form-control" :min-datetime="minDate" class="theme-amadeus"></datetime>
            </div>
        </div> 
        <br />
        <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToSignOrderPage()">POST FEE
                    <img src="../../assets/arrow-right.svg"/>
                </a>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import TokensList from './../getorders/TokensList.vue'
import { BigNumber } from 'bignumber.js'
import { Component, Watch } from 'vue-property-decorator'
import { Mutation, Getter } from 'vuex-class'
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import { Settings } from 'luxon'
import Vue from 'vue'

Settings.defaultLocale = 'en'

@Component({
  components: { 'tokens-list': TokensList, 'datetime': Datetime }
})

export default class PostFee extends Vue {
  takerToken: string = ''
  makerToken: string = ''
  maxAmount: string = ''
  makerAmount: string = ''
  date: Date = new Date()
  minDate: string = (new Date()).toISOString()
  error: string = ''

  $refs: {
    makerTokenRef: TokensList,
    takerTokenRef: TokensList
  }

  @Mutation changePage
  @Getter getTokenPairs

  goToSignOrderPage () {
    this.changePage(4);
  }

  updateTakerToken (value : string) {
    this.takerToken = value
    this.$refs.makerTokenRef.refreshToken(this.takerToken, false)
    this.updateMaxAmount()
  }

  updateMakerToken (value : string) {
    this.makerToken = value
    this.$refs.takerTokenRef.refreshToken(this.makerToken, true)
    this.updateMaxAmount()
  }

  updateMaxAmount () {
    if (this.makerToken !== '' && this.takerToken !== '') {
      var tokens = this.getTokenPairs
      var selectedPair = tokens.filter(function (token) {
        return token.tokenASymbol === this.makerToken && token.tokenBSymbol === this.takerToken;
      }.bind(this));
      if (selectedPair != null && selectedPair.length > 0) {
        var makerAmount = new BigNumber(selectedPair[0].maxTokenBAmount)
        var conv = new BigNumber(1000000000000000000)
        BigNumber.config({ DECIMAL_PLACES: 4 })
        this.maxAmount = makerAmount.dividedBy(conv).toFormat()
      }
    }
  }

  setError (value) {
    this.error = value
  }

  mounted () {
    this.$refs.makerTokenRef.refreshToken(this.takerToken, false)
    this.$refs.takerTokenRef.refreshToken(this.makerToken, true)
  }

  @Watch('makerAmount')
  onMakerAmountChanged (val: string, oldVal: string) {
    if (new BigNumber(val).comparedTo(new BigNumber(this.maxAmount)) === 1) {
      this.setError('Value is greater than the max')
    } else {
      this.setError('')
    }
  }
}
</script>

<style scoped>
#post-fee-section .container {
    padding-top: 100px;
    padding-right: 30px;
    color: white;
}

#post-fee-section .container p{
    font-size: 21px;
    color: #ffffff;
    font-weight: 300;
}

#post-fee-section input.form-control {
  border-radius: 3px;
  background-color: rgba(119, 117, 144, 0.5);
  color: #ffffff;
  border: none;
  height: 52px !important;
}

#post-fee-section input.form-control:disabled{
  background-color: rgba(119, 117, 144, 0.1);
}

#post-fee-section p.error{
  padding: 0px;
  margin: 0px;
  color: red;
  opacity: 0.9;
  font-size: 13px;
}
</style>