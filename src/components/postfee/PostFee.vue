<template>
<div id="post-fee-section">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <p>The DApp needs to choose the token and the amount it wants to sell as well as the token to buy. We will return the maximum amount we are willing to buy.</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-3">
                <label>Maker token (to sell)</label>
                <input class="form-control" v-model="makerToken" disabled/> 
            </div>
            <div class="col-md-3">
                <label>Taker token (to buy)</label>
                <input class="form-control" v-model="takerToken" disabled/> 
            </div>
            <div class="col-md-2">
                <label>Price</label>
                <input class="form-control" v-model="priceObj.price" disabled/> 
            </div>
            <div class="col-md-2">
                <label>Max Amount</label>
                <input class="form-control" v-model="priceObj.maxAmountFrom" disabled/> 
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
                <a class="btn-next-step" @click="goToSignOrderPage()" v-bind:class="{'inactive': !enablePostFee}">GET FEE
                    <img src="../../assets/arrow-right.svg"/>
                </a>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { BigNumber } from 'bignumber.js'
import { Component, Watch } from 'vue-property-decorator'
import { Mutation, Getter } from 'vuex-class'
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import { Settings } from 'luxon'
import Vue from 'vue'
import { OrderService, ZeroXService, BuildOrderService } from '../../api'
import { Order } from '../../model/order'
import { Price } from '../../model/price'
import { Scripts } from '../../utils/scripts'

Settings.defaultLocale = 'en'

@Component({
  components: { 'datetime': Datetime }
})

export default class PostFee extends Vue {
  zeroXService: ZeroXService;
  takerToken: string = ''
  makerToken: string = ''
  maxAmount: BigNumber = null
  maxAmountString: string = ''
  makerAmount: string = ''
  date: string = new Date((new Date()).getTime() + 10 * 60000).toISOString()
  minDate: string = (new Date()).toISOString()
  takerAmount: BigNumber = null
  enablePostFee: boolean = false
  priceObj: Price = null
  makerAmountError: string = ''
  dateError: string = ''

  @Getter getPrice
  @Mutation addCodeLine
  @Mutation changePage
  @Mutation updateErrorMessage
  @Mutation updateLoadingState
  @Mutation selectOrder
  @Mutation updateErrorModel

  goToSignOrderPage () {
    if (this.validateRequiredFields()) {
      var orderService : OrderService = new OrderService(new ZeroXService(), new BuildOrderService());
      this.updateLoadingState(true);
      const timestamp = Math.floor(new Date(this.date).getTime() / 1000);
      orderService.postFee(this.priceObj.tokenFrom, new BigNumber(this.makerAmount), this.priceObj.tokenTo, this.takerAmount, this.zeroXService.getCoinBase(), new BigNumber(timestamp))
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
    this.changePage(5)
  }

  validateRequiredFields () {
    var valid = true;
    if (this.makerAmount === null || this.makerAmount === '') {
      valid = false
    } else if (new BigNumber(this.makerAmount).comparedTo(this.priceObj.maxAmountFrom.replace(/,\s?/g, '')) === 1) {
      this.makerAmountError = 'Value is greater than max'
      valid = false
    }
    if (this.date === null || this.date === '') {
      valid = false
    } else if (new Date(this.date) <= new Date()) {
      this.dateError = 'invalid date'
      valid = false
    }
    this.enablePostFee = valid;
    return valid
  }

  setTakerSymbol () {
    var zeroXService = new ZeroXService()
    zeroXService.getTokenSymbol(this.priceObj.tokenTo).then((response) => {
      this.takerToken = response
    });
  }

  setMakerSymbol () {
    var zeroXService = new ZeroXService()
    zeroXService.getTokenSymbol(this.priceObj.tokenFrom).then((response) => {
      this.makerToken = response
    })
  }

  mounted () {
    this.priceObj = this.getPrice
    this.zeroXService = new ZeroXService()
    this.setTakerSymbol()
    this.setMakerSymbol()
  }

  @Watch('makerAmount')
  onMakerAmountChanged (val: string, oldVal: string) {
    debugger;
    if (val !== null && val !== '') {
      if (new BigNumber(val).comparedTo(this.priceObj.maxAmountFrom.replace(/,\s?/g, '')) !== 1) {
        this.makerAmountError = ''
      }
      this.takerAmount = new BigNumber(val).mul(this.priceObj.price)
    }
    this.validateRequiredFields();
  }

  @Watch('date')
  onDateChanged (val: string, oldVal: string) {
    if (val !== null && val !== '') {
      this.dateError = ''
    }
    this.validateRequiredFields();
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

#post-fee-section .btn-next-step.inactive{
  opacity: 0.5;
  cursor: default;
}

</style>