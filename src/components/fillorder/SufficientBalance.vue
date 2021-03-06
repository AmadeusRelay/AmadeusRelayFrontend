<template>
    <div class="col-md-12 bottom-space">
        <label>
        <span class="cb-validation" v-bind:class="{'active' : !needBalance && !needFeeBalance, 'inactive' : needBalance || needFeeBalance }"></span>
        Have sufficient balance
        <div>
            <div class='item-details'>Your transaction balance: {{balanceAmount}} {{tokenSold.symbol}}</div>
        </div>
        <div v-if='feeAmount && tokenSold.symbol !== "ZRX"'>
            <div class='item-details'>Your fee balance: {{this.tokenBought.symbol === 'ZRX' ? 'don\'t worry! The fee will be deduced from ' + (this.isQuoteProvider? 'taker amount' : 'maker amount') : feeBalanceAmount + ' ZRX'}}</div>
        </div>
        </label>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { ZeroXService } from '../../api'
import { BigNumber } from 'bignumber.js'
import { TokenInfo } from '../../model/tokenInfo'

@Component
export default class SufficientBalance extends Vue {
  needBalance: boolean = true;
  needFeeBalance: boolean = true;
  balanceAmount: string = '';
  feeBalanceAmount: string = '0';
  amount: BigNumber = new BigNumber(0);
  feeAmount: BigNumber = null;
  zeroXService: ZeroXService;
  tokenSold: TokenInfo = { symbol: '', address: '', fee: new BigNumber(0), unit: new BigNumber(0) };
  tokenBought: TokenInfo = { symbol: '', address: '', fee: new BigNumber(0), unit: new BigNumber(0) };
  isDestroyed: boolean = false;
  feeUnit: BigNumber;
  isQuoteProvider = false;

  @Getter getTokenSold
  @Getter getTokenBought
  @Getter getFeeToPay
  @Getter getTokenSoldAmount
  @Getter getFeeUnit
  @Mutation updateNeedBalance
  @Mutation updateNeedFeeBalance
  @Getter getStrategyId

  mounted () {
    this.zeroXService = new ZeroXService();
    this.amount = this.getTokenSoldAmount;
    this.tokenSold = this.getTokenSold;
    this.tokenBought = this.getTokenBought;
    this.feeAmount = this.getFeeToPay;
    this.isDestroyed = false;
    this.feeUnit = this.getFeeUnit;

    this.isQuoteProvider = this.getStrategyId === 2;
    this.isNecessaryToCheckBalance();
    this.isNecessaryToCheckFeeBalance();
  }

  destroyed () {
    this.isDestroyed = true;
  }

  isNecessaryToCheckBalance () {
    if (this.isDestroyed) return;

    if (this.tokenSold.symbol === 'ETH') {
      this.zeroXService.getBalance(this.tokenSold.address, this.zeroXService.getCoinBase()).then(amount => {
        var wethAmount: BigNumber = amount;
        this.zeroXService.getEthBalance().then(amount => {
          this.checkNecessaryBalance(wethAmount.add(amount))
        });
      });
    } else {
      this.zeroXService.getBalance(this.tokenSold.address, this.zeroXService.getCoinBase()).then(amount => this.checkNecessaryBalance(amount));
    }
  }

  isNecessaryToCheckFeeBalance () {
    if (this.isDestroyed) return;

    if (this.tokenBought.symbol === 'ZRX') {
      this.needFeeBalance = false;
      this.updateNeedFeeBalance(false);
    } else {
      this.zeroXService.getZeroXAddress().then(address => {
        this.zeroXService.getBalance(address, this.zeroXService.getCoinBase()).then(amount => this.checkNecessaryFeeBalance(amount));
      });
    }
  }

  checkNecessaryBalance (amount: BigNumber) {
    this.balanceAmount = amount.dividedBy(this.tokenSold.unit).toFormat();
    let necessaryAmount = this.tokenSold.symbol !== 'ZRX' || !this.feeAmount ? this.amount : this.amount.plus(this.feeAmount);
    this.needBalance = !amount.greaterThanOrEqualTo(necessaryAmount);
    this.updateNeedBalance(this.needBalance);
    if (this.needBalance) {
      setTimeout(() => this.isNecessaryToCheckBalance(), 1000);
    }
  }

  checkNecessaryFeeBalance (fee: BigNumber) {
    this.feeBalanceAmount = fee.dividedBy(this.feeUnit).toFormat();
    if (this.feeAmount && this.tokenSold.symbol !== 'ZRX') {
      this.needFeeBalance = !fee.greaterThanOrEqualTo(this.feeAmount);
    } else {
      this.needFeeBalance = false;
    }
    if (this.needFeeBalance) {
      setTimeout(() => this.isNecessaryToCheckFeeBalance(), 1000);
    }

    this.updateNeedFeeBalance(this.needFeeBalance);
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