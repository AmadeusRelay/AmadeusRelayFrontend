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
                <p v-if="makerTokenError" class="error">{{makerTokenError}}</p>
            </div>
            <div class="col-md-4">
                <label>Taker token (to buy)</label>
                <tokens-list :token='takerToken' ref="takerTokenRef" @updateToken='updateTakerToken'/>
                <p v-if="takerTokenError" class="error">{{takerTokenError}}</p>
            </div>
            <div class="col-md-2">
                <label>Max Amount</label>
                <input class="form-control" v-model="maxAmount" disabled/> 
            </div>
            <div class="col-md-2 div-maker-amount">
                <label>Maker Amount</label>
                <input v-model="makerAmount" class="form-control" /> 
                <p v-if="makerAmountError" class="error">{{makerAmountError}}</p>
            </div>
        </div> 
        <br/>
        <div class="row">
            <div class="col-md-4">
                <label>Expiration date</label>
                <datetime v-model="date" type="datetime" input-class="form-control" :min-datetime="minDate" class="theme-amadeus"></datetime>
                <p v-if="dateError" class="error">{{dateError}}</p>
            </div>
        </div> 
        <br />
        <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToSignOrderPage()">GET FEE
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
import { OrderService, ZeroXService, BuildOrderService } from '../../api'
import { Order } from '../../model/order'
import { Scripts } from '../../utils/scripts'

Settings.defaultLocale = 'en'

@Component({
  components: { 'tokens-list': TokensList, 'datetime': Datetime }
})

export default class PostFee extends Vue {
  zeroXService: ZeroXService;
  takerToken: string = ''
  makerToken: string = ''
  maxAmount: string = ''
  makerAmount: string = ''
  makerTokenAddress: string = ''
  takerTokenAddress: string = ''
  date: string = new Date((new Date()).getTime() + 10 * 60000).toISOString()
  minDate: string = (new Date()).toISOString()
  price: BigNumber = new BigNumber(1)
  takerAmount: BigNumber = null
  maxAmountCodeAdded: boolean = false

  takerTokenError: string = ''
  makerTokenError: string = ''
  makerAmountError: string = ''
  dateError: string = ''

  $refs: {
    makerTokenRef: TokensList,
    takerTokenRef: TokensList
  }

  @Mutation addCodeLine
  @Mutation changePage
  @Getter getTokenPairs
  @Mutation updateErrorMessage
  @Mutation updateLoadingState
  @Mutation selectOrder
  @Mutation updateErrorModel

  goToSignOrderPage () {
    if (this.validateRequiredFields()) {
      var orderService : OrderService = new OrderService(new ZeroXService(), new BuildOrderService());
      this.updateLoadingState(true);
      const timestamp = Math.floor(new Date(this.date).getTime() / 1000);
      orderService.postFee(this.makerTokenAddress, new BigNumber(this.makerAmount), this.takerTokenAddress, this.takerAmount, this.zeroXService.getCoinBase(), new BigNumber(timestamp))
        .then(this.onSuccessfullyPostFee)
        .catch((e) => {
          this.updateErrorModel(e);
          this.updateLoadingState(false)
        });
    }
  }

  onSuccessfullyPostFee (order: Order) {
    this.updateLoadingState(false)
    this.selectOrder(order)
    this.addCodeLine(new Scripts().postFee)
    this.changePage(4)
  }

  validateRequiredFields () {
    var valid = true;
    if (this.takerToken === null || this.takerToken === '') {
      this.takerTokenError = 'required'
      valid = false
    }
    if (this.makerToken === null || this.makerToken === '') {
      this.makerTokenError = 'required'
      valid = false
    }
    if (this.makerAmount === null || this.makerAmount === '') {
      this.makerAmountError = 'required'
      valid = false
    } else if (new BigNumber(this.makerAmount).comparedTo(new BigNumber(this.maxAmount)) === 1) {
      this.makerAmountError = 'Value is greater than max'
      valid = false
    }
    if (this.date === null || this.date === '') {
      this.dateError = 'required'
      valid = false
    } else if (new Date(this.date) <= new Date()) {
      this.dateError = 'invalid date'
      valid = false
    }

    return valid
  }

  updateTakerToken (value : string) {
    this.takerToken = value
    this.$refs.makerTokenRef.refreshToken(this.takerToken, false)
    this.zeroXService.getTokenAddress(value).then(address => this.updateTakerTokenAddress(address));
    this.updateMaxAmountAndPrice()
  }

  updateTakerTokenAddress (address: string) {
    this.takerTokenAddress = address
  }

  updateMakerToken (value : string) {
    this.makerToken = value
    this.$refs.takerTokenRef.refreshToken(this.makerToken, true)
    this.zeroXService.getTokenAddress(value).then(address => this.updateMakerTokenAddress(address));
    this.updateMaxAmountAndPrice()
  }

  updateMakerTokenAddress (address: string) {
    this.makerTokenAddress = address
  }

  updateMaxAmountAndPrice () {
    if (this.makerToken !== '' && this.takerToken !== '') {
      var tokens = this.getTokenPairs
      var selectedPair = tokens.filter(function (token) {
        return token.tokenASymbol === this.makerToken && token.tokenBSymbol === this.takerToken;
      }.bind(this));
      if (selectedPair != null && selectedPair.length > 0) {
        var makerMaxAmount = new BigNumber(selectedPair[0].maxTokenAAmount)
        var conv = new BigNumber(1000000000000000000)
        BigNumber.config({ DECIMAL_PLACES: 8 })
        this.maxAmount = makerMaxAmount.dividedBy(conv).toFormat()
        this.price = new BigNumber(selectedPair[0].maxTokenBAmount).dividedBy(makerMaxAmount)
        if (this.makerAmount !== null && this.makerAmount !== '') {
          if (new BigNumber(this.makerAmount).comparedTo(new BigNumber(this.maxAmount)) !== 1) {
            this.makerAmountError = ''
          }
          this.takerAmount = new BigNumber(this.makerAmount).mul(this.price)
        }
      }
      this.addMaxAmountCodeLine();
    }
  }

  addMaxAmountCodeLine () {
    if (!this.maxAmountCodeAdded) {
      this.addCodeLine(new Scripts().maxAmount)
      this.maxAmountCodeAdded = true
    }
  }

  mounted () {
    this.$refs.makerTokenRef.refreshToken(this.takerToken, false)
    this.$refs.takerTokenRef.refreshToken(this.makerToken, true)
    this.zeroXService = new ZeroXService()
  }

  @Watch('makerAmount')
  onMakerAmountChanged (val: string, oldVal: string) {
    if (val !== null && val !== '') {
      if (new BigNumber(val).comparedTo(new BigNumber(this.maxAmount)) !== 1) {
        this.makerAmountError = ''
      }
      this.takerAmount = new BigNumber(val).mul(this.price)
    }
  }

  @Watch('makerToken')
  onMakerTokenChanged (val: string, oldVal: string) {
    if (val !== null && val !== '') {
      this.makerTokenError = ''
    }
  }

  @Watch('takerToken')
  onTakerTokenChanged (val: string, oldVal: string) {
    if (val !== null && val !== '') {
      this.takerTokenError = ''
    }
  }

  @Watch('date')
  onDateChanged (val: string, oldVal: string) {
    if (val !== null && val !== '') {
      this.dateError = ''
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
  font-size: 13px;
  position: absolute;
}

#post-fee-section .form-group{
  margin-bottom: 0px;
}

#post-fee-section .div-maker-amount{
  padding-right: 0px;
}

</style>