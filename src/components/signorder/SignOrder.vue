<template>
<div id="sign-order-section">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <p>Our API returns the fee recipient address and the fee value. First the DApp needs to sign the order and then use end point <b>POST order.</b></p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <table class="table table-striped table-condensed">
                    <thead class="table-order-head">
                        <tr>
                            <th>Transaction</th>
                            <th>Expiration Date</th>
                            <th>Rate</th>
                            <th>Fee</th>
                            <th>Maker Amount</th>
                            <th>Taker Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{makerSymbol}} <i class="fa fa-long-arrow-right" aria-hidden="true"></i> {{takerSymbol}}</td>
                            <td>{{expiringDate}}</td>
                            <td>1 : {{rate}}</td>
                            <td>{{fee}}</td>
                            <td>{{makerAmount}}</td>
                            <td>{{takerAmount}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="signOrder()">SIGN ORDER
                    <img src="../../assets/arrow-right.svg"/>
                </a>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Mutation, Getter } from 'vuex-class'
import { ZeroXService } from '../../api'
import { BigNumber } from 'bignumber.js'

@Component
export default class SignOrder extends Vue {
  takerSymbol: string = ''
  makerSymbol: string = ''
  hasToChangePage: boolean = false

  @Getter getSelectedOrder
  @Mutation changePage
  @Mutation updateSignOrder
  @Mutation updateTokenSold
  @Mutation updateTokenBought
  @Mutation updateFeeToPay
  @Mutation updateTokenSoldAmount
  @Mutation updateLoadingState
  @Mutation updateErrorMessage

  mounted () {
    this.setTakerSymbol();
    this.setMakerSymbol();
  }

  get order () {
    return this.getSelectedOrder
  }

  get expiringDate () {
    var date = new Date(this.order.expirationUnixTimestampSec * 1000)
    var day = ('0' + date.getDate()).slice(-2)
    var month = ('0' + (date.getMonth() + 1)).slice(-2)
    var year = date.getFullYear()
    var hours = ('0' + date.getHours()).slice(-2)
    var minutes = ('0' + date.getMinutes()).slice(-2)
    var seconds = ('0' + date.getSeconds()).slice(-2)
    return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds
  }

  get rate () {
    var makerAmount = new BigNumber(this.order.makerTokenAmount)
    var takerAmount = new BigNumber(this.order.takerTokenAmount)
    BigNumber.config({ DECIMAL_PLACES: 4 })
    return makerAmount.dividedBy(takerAmount).toFormat()
  }

  get fee () {
    var fee = new BigNumber(this.order.takerFee)
    var conv = new BigNumber(1000000000000000000)
    BigNumber.config({ DECIMAL_PLACES: 6 })
    return fee.dividedBy(conv).toFormat()
  }

  get makerAmount () {
    BigNumber.config({ DECIMAL_PLACES: 6 })
    return new BigNumber(this.order.makerTokenAmount).dividedBy(new BigNumber(1000000000000000000)).toFormat()
  }

  get takerAmount () {
    BigNumber.config({ DECIMAL_PLACES: 6 })
    return new BigNumber(this.order.takerTokenAmount).dividedBy(new BigNumber(1000000000000000000)).toFormat()
  }

  setTakerSymbol () {
    var zeroXService = new ZeroXService()
    zeroXService.getTokenSymbol(this.order.takerTokenAddress).then((response) => {
      this.takerSymbol = response
    });
  }

  setMakerSymbol () {
    var zeroXService = new ZeroXService()
    zeroXService.getTokenSymbol(this.order.makerTokenAddress).then((response) => {
      this.makerSymbol = response
    })
  }

  signOrder () {
    var zeroXService = new ZeroXService()
    this.updateLoadingState(true);
    zeroXService.signOrder(this.order)
    .then(signedOrder => this.onSuccessfullySignOrder(signedOrder))
    .catch((e) => {
      this.updateErrorMessage(e.message)
      this.updateLoadingState(false)
      this.changePage(7)
    });
  }

  onSuccessfullySignOrder (signedOrder: any) {
    this.updateSignOrder(signedOrder)
    const zeroXService = new ZeroXService();
    zeroXService.getTokenSymbol(signedOrder.makerTokenAddress).then(symbol => this.setTokenSold(symbol));
    zeroXService.getTokenSymbol(signedOrder.takerTokenAddress).then(symbol => this.setTokenBought(symbol));
    this.updateLoadingState(false)
    this.setFeeToPay();
  }

  setTokenSold (symbol: string) {
    this.updateTokenSold({
      symbol: symbol,
      address: this.order.makerTokenAddress,
      fee: this.order.makerFee
    });
    this.updateTokenSoldAmount(new BigNumber(this.order.makerTokenAmount))
    this.goToPostOrderPage();
  }

  setTokenBought (symbol: string) {
    this.updateTokenBought({
      symbol: symbol,
      address: this.order.takerTokenAddress,
      fee: this.order.takerFee
    });
    this.goToPostOrderPage();
  }

  goToPostOrderPage () {
    if (!this.hasToChangePage) {
      this.hasToChangePage = true;
    } else {
      this.changePage(5);
    }
  }

  setFeeToPay () {
    const orderFee = new BigNumber(this.order.makerFee ? this.order.makerFee : '0');
    this.updateFeeToPay(orderFee);
  }
}
</script>

<style scoped>
#sign-order-section .container {
    padding-top: 100px;
    padding-right: 30px;
    color: white;
}

#sign-order-section .container p{
    font-size: 21px;
    color: #ffffff;
    font-weight: 300;
}

table td{
    background-color: rgba(255, 255, 255, 0.1);
}

table {
    text-align: center;
}

table.table th{
    border: none;
}
</style>