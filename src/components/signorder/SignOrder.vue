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
                            <td>{{tokenSold.symbol}} <i class="fa fa-long-arrow-right" aria-hidden="true"></i> {{tokenBought.symbol}}</td>
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
import { TokenInfo } from '../../model/tokenInfo'

@Component
export default class SignOrder extends Vue {
  tokenSold: TokenInfo = { symbol: '', address: '', fee: new BigNumber(0), unit: new BigNumber(0) };
  tokenBought: TokenInfo = { symbol: '', address: '', fee: new BigNumber(0), unit: new BigNumber(0) };
  feeUnit: BigNumber = new BigNumber(0);

  @Getter getSelectedOrder
  @Getter getTokenSold
  @Getter getTokenBought
  @Getter getFeeUnit
  @Mutation changePage
  @Mutation updateSignOrder
  @Mutation updateFeeToPay
  @Mutation updateLoadingState
  @Mutation updateErrorModel

  mounted () {
    this.tokenSold = this.getTokenSold;
    this.tokenBought = this.getTokenBought;
    this.feeUnit = this.getFeeUnit;
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
    BigNumber.config({ DECIMAL_PLACES: 5 })
    return takerAmount.dividedBy(makerAmount).toFormat()
  }

  get fee () {
    var fee = new BigNumber(this.order.makerFee)
    BigNumber.config({ DECIMAL_PLACES: 6 })
    return fee.dividedBy(this.feeUnit).toFormat()
  }

  get makerAmount () {
    BigNumber.config({ DECIMAL_PLACES: 6 })
    return new BigNumber(this.order.makerTokenAmount).dividedBy(new BigNumber(this.tokenSold.unit)).toFormat()
  }

  get takerAmount () {
    BigNumber.config({ DECIMAL_PLACES: 6 })
    return new BigNumber(this.order.takerTokenAmount).dividedBy(new BigNumber(this.tokenBought.unit)).toFormat()
  }

  signOrder () {
    var zeroXService = new ZeroXService()
    this.updateLoadingState(true);
    zeroXService.signOrder(this.order)
    .then(signedOrder => this.onSuccessfullySignOrder(signedOrder))
    .catch((e) => {
      this.updateErrorModel('Signature cancelled')
      this.updateLoadingState(false)
    });
  }

  onSuccessfullySignOrder (signedOrder: any) {
    this.updateSignOrder(signedOrder)
    this.updateLoadingState(false)
    this.setFeeToPay()
    this.changePage(6)
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