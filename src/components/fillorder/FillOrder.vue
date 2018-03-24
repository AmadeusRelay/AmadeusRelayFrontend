<template>
<div id="fill-order-section">
      <div class="container">
          <div class="row">
            <div class="col-md-12">
                <p>In order to be able to fill your chosen order ({{amount.dividedBy(1000000000000000000).toFormat()}} {{token}} {{feeAmount ? " - " + feeAmount.dividedBy(1000000000000000000).toFormat() + ' ZRX': ''}}), you need to: </p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 bottom-space">
              <label>
                <span class="cb-validation" v-bind:class="{'active' : !needBalance && !needFeeBalance, 'inactive' : needBalance || needFeeBalance }"></span>
                Have sufficient balance
                <div>
                  <div class='item-details'>Balance: {{balanceAmount}} {{token}}</div>
                </div>
                <div>
                  <div class='item-details'>ZRX Balance: {{feeBalanceAmount}} ZRX</div>
                </div>
              </label>
            </div>
            <div class="col-md-12 bottom-space">
            <label>
              <span class="cb-validation" v-bind:class="{'active' : !needToWrapETH, 'inactive' :needToWrapETH}"></span> Convert ETH in WETH
                <div v-if='token==="ETH"'>
                  <div class='item-details'>Converted: {{convertedAmount}} {{convertedToken}}</div>
                  <a v-if='needToWrapETH && !needBalance' class="btn-action" @click="wrapETH()">Convert</a>
                </div>
                <div v-if='token!=="ETH"'>
                  <div class='item-details'>The conversion is only applied to ETH token</div>
                </div>
            </label>
            </div>
            <div class="col-md-12 bottom-space">
              <label>
                <span class="cb-validation" v-bind:class="{'active' : !needToSetAllowance && !needToSetFeeAllowance, 'inactive' : needToSetAllowance || needToSetFeeAllowance}"></span> Authorize 0x to interact with your funds
                <div>
                  <div class='item-details'>Authorized: {{authorizedAmount}} {{convertedToken}}</div>
                  <a v-if='needToSetAllowance' class="btn-action" @click="setAllowance()">Authorize</a>
                </div>
                <div>
                <div class='item-details'>Authorized: {{authorizedZrxAmount}} ZRX</div>
                  <a v-if='needToSetFeeAllowance' class="btn-action" @click="setFeeAllowance()">Authorize</a>
                </div>
              </label>
            </div>       
          </div>
          <div class="row">
            <div class="col-md-12">
                <p>The dApp fills its address as taker address, the taker desired amount and calls <b>fillOrder</b> to complete the order. </p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToFinalPage()" v-bind:class="{'inactive': needBalance || needToWrapETH || needToSetAllowance || needFeeBalance || needToSetFeeAllowance}">FILL ORDER
                <img src="../../assets/arrow-right.svg"/>
                </a>
            </div>
        </div>
      </div>
</div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { ZeroXService } from '../../api'
import { BigNumber } from 'bignumber.js'
import { Order } from '../../model/order'
import { Scripts } from '../../utils/scripts'

@Component
export default class FillOrder extends Vue {
  needToWrapETH: boolean = true
  needToSetAllowance: boolean = true
  needToSetFeeAllowance: boolean = true
  needBalance: boolean = true;
  needFeeBalance: boolean = true;
  token: string = '';
  convertedToken: string = '';
  balanceAmount: string = '';
  feeBalanceAmount: string = '0';
  convertedAmount: string = '';
  authorizedAmount: string = '';
  authorizedZrxAmount: string = '';
  order: Order;
  amount: BigNumber = new BigNumber(0);
  feeAmount: BigNumber = null;
  zeroXService: ZeroXService;
  isWrapping: boolean = false;
  isAuthorizing: boolean = false;
  isAuthorizingFee: boolean = false;
  isFilling: boolean = false;

  @Getter getSelectedOrder
  @Getter getTakerAmount
  @Mutation addCodeLine
  @Mutation changePage
  @Mutation updateErrorMessage
  @Mutation updateLoadingState

  goToFinalPage () {
    if (this.needToWrapETH || this.needToSetAllowance || this.needBalance || this.isFilling || this.needFeeBalance || this.needToSetFeeAllowance) {
      return;
    }
    this.isFilling = true;
    this.updateLoadingState(true)
    this.zeroXService.fillOrder(this.order, this.amount).then(this.onSuccessfullyFillOrder).catch((e) => {
      this.updateErrorMessage(e.message);
      this.updateLoadingState(false)
      this.changePage(6);
    });
  }

  onSuccessfullyFillOrder () {
    this.updateLoadingState(false)
    this.changePage(5)
  }

  mounted () {
    this.zeroXService = new ZeroXService();
    this.order = this.getSelectedOrder;
    this.amount = this.getTakerAmount;
    this.zeroXService.getTokenSymbol(this.order.takerTokenAddress).then(symbol => this.setToken(symbol));
    this.addCodeLine(new Scripts().fillOrder);
    let orderFee = new BigNumber(this.order.takerFee ? this.order.takerFee : '0');
    if (orderFee.greaterThan(0)) {
      const orderTakerAmount = new BigNumber(this.order.takerTokenAmount);
      this.feeAmount = orderFee.mul(this.amount).dividedBy(orderTakerAmount);
    } else {
      this.feeAmount = null;
    }
  }

  setToken (symbol: string) {
    this.token = symbol;
    if (this.token === 'ETH') {
      this.isNecessaryToWrapETH();
      this.convertedToken = 'WETH';
    } else {
      this.needToWrapETH = false;
      this.convertedToken = symbol;
    }
    this.isNecessaryToCheckBalance();
    this.isNecessaryToCheckFeeBalance();
    this.isNecessaryToSetAllowance();
    this.isNecessaryToSetFeeAllowance();
  }

  isNecessaryToCheckBalance () {
    if (this.token === 'ETH') {
      this.zeroXService.getBalance(this.order.takerTokenAddress, this.zeroXService.getCoinBase()).then(amount => {
        var wethAmount: BigNumber = amount;
        this.zeroXService.getEthBalance().then(amount => {
          this.checkNecessaryBalance(wethAmount.add(amount))
        });
      });
    } else {
      this.zeroXService.getBalance(this.order.takerTokenAddress, this.zeroXService.getCoinBase()).then(amount => this.checkNecessaryBalance(amount));
    }
  }

  isNecessaryToCheckFeeBalance () {
    this.zeroXService.getBalance('0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570', this.zeroXService.getCoinBase()).then(amount => this.checkNecessaryFeeBalance(amount));
  }

  isNecessaryToWrapETH () {
    this.zeroXService.isNecessaryToWrapETH(this.amount, this.order.takerTokenAddress).then(this.checkNecessaryToWrapETH);
  }

  isNecessaryToSetAllowance () {
    this.zeroXService.isNecessaryToSetAllowance(this.amount, this.order.takerTokenAddress).then(this.checkNecessaryToSetAllowance);
  }

  isNecessaryToSetFeeAllowance () {
    this.zeroXService.isNecessaryToSetAllowance(new BigNumber(this.order.takerFee), '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570').then(this.checkNecessaryToSetFeeAllowance);
  }

  checkNecessaryBalance (amount: BigNumber) {
    this.balanceAmount = amount.dividedBy(1000000000000000000).toFormat();
    this.needBalance = !amount.greaterThanOrEqualTo(this.amount);
    if (this.needBalance) {
      setTimeout(() => this.isNecessaryToCheckBalance(), 1000);
    }
  }

  checkNecessaryFeeBalance (fee: BigNumber) {
    this.feeBalanceAmount = fee.dividedBy(1000000000000000000).toFormat();
    if (this.feeAmount) {
      this.needFeeBalance = !fee.greaterThanOrEqualTo(this.feeAmount);
    } else {
      this.needFeeBalance = false;
    }
    if (this.needFeeBalance) {
      setTimeout(() => this.isNecessaryToCheckFeeBalance(), 1000);
    }
  }

  checkNecessaryToWrapETH (result) {
    this.needToWrapETH = result.needWrap;
    this.convertedAmount = result.currentWrapped.dividedBy(1000000000000000000).toFormat();
    if (this.needToWrapETH) {
      setTimeout(() => this.isNecessaryToWrapETH(), 2000);
    }
  }

  checkNecessaryToSetAllowance (result) {
    this.needToSetAllowance = result.needAllowance;
    let amount: BigNumber = result.currentAllowance.dividedBy(1000000000000000000);
    if (amount.lessThanOrEqualTo(1000000000)) {
      this.authorizedAmount = amount.toFormat();
    } else {
      this.authorizedAmount = 'more than 1 billion';
    }
    if (this.needToSetAllowance) {
      setTimeout(() => this.isNecessaryToSetAllowance(), 2000);
    }
  }

  checkNecessaryToSetFeeAllowance (result) {
    this.needToSetFeeAllowance = result.needAllowance;
    let amount: BigNumber = result.currentAllowance.dividedBy(1000000000000000000);
    if (amount.lessThanOrEqualTo(1000000000)) {
      this.authorizedZrxAmount = amount.toFormat();
    } else {
      this.authorizedZrxAmount = 'more than 1 billion';
    }
    if (this.needToSetFeeAllowance) {
      setTimeout(() => this.isNecessaryToSetFeeAllowance(), 2000);
    }
  }

  wrapETH () {
    if (this.isWrapping) {
      return;
    }
    this.isWrapping = true;
    this.updateLoadingState(true);
    this.zeroXService.wrapETH(this.amount, this.order.takerTokenAddress).then(() => {
      this.isNecessaryToWrapETH();
      this.updateLoadingState(false);
      this.isWrapping = false;
    }).catch((e) => {
      this.isWrapping = false;
      this.updateLoadingState(false);
      return e;
    });
  }

  setAllowance () {
    if (this.isAuthorizing) {
      return;
    }
    this.isAuthorizing = true;
    this.updateLoadingState(true);
    this.zeroXService.ensureAllowance(this.amount, this.order.takerTokenAddress).then(() => {
      this.isNecessaryToSetAllowance();
      this.updateLoadingState(false);
      this.isAuthorizing = false;
    }).catch((e) => {
      this.isAuthorizing = false;
      this.updateLoadingState(false);
      return e;
    });
  }

  setFeeAllowance () {
    if (this.isAuthorizingFee) {
      return;
    }
    this.isAuthorizingFee = true;
    this.updateLoadingState(true);
    this.zeroXService.ensureAllowance(new BigNumber(this.order.takerFee), '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570').then(() => {
      this.isNecessaryToSetFeeAllowance();
      this.updateLoadingState(false);
      this.isAuthorizingFee = false;
    }).catch((e) => {
      this.isAuthorizingFee = false;
      this.updateLoadingState(false);
      return e;
    });
  }
}
</script>

<style scoped>
  #fill-order-section .container {
      padding-top: 80px;
      color: white;
  }

  #fill-order-section .container p{ 
      font-size: 22px; 
      color: #ffffff; 
      font-weight: 300; 
      color: white; 
  } 

  #fill-order-section .cb-validation{
    font-family: Lato;
    font-size: 18px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    width: 25px;
    height: 25px;
    background-image: url("../../assets/oval-5-copy-2.svg");
    display: inline-block;
    vertical-align: top;
    padding-right: 35px;
    background-repeat: no-repeat;
    background-size: 24px;
  }

  #fill-order-section .cb-validation.active{
    background-image: url("../../assets/combined-shape-copy.svg");
  }

  #fill-order-section .cb-validation.inactive{
    background-image: url("../../assets/error-x.svg");
  }

  #fill-order-section .bottom-space {
    margin-bottom: 20px;
  }

  #fill-order-section .item-details {
    font-family: Lato;
    font-size: 18px;
    padding-left: 40px;
    font-weight: 200;
    display: inline;
  }

  #fill-order-section .container a.btn-action{
    font-size: 18px;
    color: #ff6c72;
    padding-left: 20px;
    text-transform: uppercase;
    font-weight: 500;
    cursor: pointer;
  }

   #fill-order-section .container a.btn-next-step.inactive{
    opacity: 0.5;
    cursor: default;
  }

@media (max-width: 992px){
  #fill-order-section .container {
      padding-top: 16%;
  }

  #fill-order-section .container p{ 
      font-size: 19px; 
  } 
}
</style>