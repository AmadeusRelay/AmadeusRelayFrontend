<template>
    <div class="col-md-12 bottom-space">
        <label>
        <span class="cb-validation" v-bind:class="{'active' : !needToSetAllowance && !needToSetFeeAllowance, 'inactive' : needToSetAllowance || needToSetFeeAllowance}"></span> Authorize 0x to interact with your funds
        <div>
            <div class='item-details'>Authorized: {{authorizedAmount}} {{convertedToken}}</div>
            <a v-if='needToSetAllowance' class="btn-action" @click="setAllowance()">Authorize</a>
        </div>
        <div>
        <div v-if='feeAmount && tokenSold.symbol !== "ZRX"'>
            <div class='item-details'>Authorized: {{authorizedZrxAmount}} ZRX</div>
            <a v-if='needToSetFeeAllowance' class="btn-action" @click="setFeeAllowance()">Authorize</a>
            </div>
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
export default class SetAllowance extends Vue {
  needToSetAllowance: boolean = true
  needToSetFeeAllowance: boolean = true
  convertedToken: string = '';
  authorizedAmount: string = '';
  authorizedZrxAmount: string = '';
  amount: BigNumber = new BigNumber(0);
  feeAmount: BigNumber = null;
  zeroXService: ZeroXService;
  isAuthorizing: boolean = false;
  isAuthorizingFee: boolean = false;
  tokenSold: TokenInfo = { symbol: '', address: '', fee: new BigNumber(0) };
  tokenBought: TokenInfo = { symbol: '', address: '', fee: new BigNumber(0) };
  isDestroyed: boolean = false;

  @Getter getTokenSoldAmount
  @Getter getFeeToPay
  @Getter getTokenSold
  @Getter getTokenBought
  @Mutation updateLoadingState
  @Mutation updateNeedToSetAllowance
  @Mutation updateNeedToSetFeeAllowance

  mounted () {
    this.zeroXService = new ZeroXService();
    this.amount = this.getTokenSoldAmount;
    this.tokenSold = this.getTokenSold;
    this.tokenBought = this.getTokenBought;
    this.feeAmount = this.getFeeToPay;
    this.isDestroyed = false;
    this.setConvertedToken();

    this.isNecessaryToSetAllowance();
    this.isNecessaryToSetFeeAllowance();
  }

  destroyed () {
    this.isDestroyed = true;
  }

  setConvertedToken () {
    if (this.tokenSold.symbol === 'ETH') {
      this.convertedToken = 'WETH';
    } else {
      this.convertedToken = this.tokenSold.symbol;
    }
  }

  isNecessaryToSetAllowance () {
    if (this.isDestroyed) return;

    let necessaryAmount = this.tokenSold.symbol !== 'ZRX' || !this.feeAmount ? this.amount : this.amount.plus(this.feeAmount);
    this.zeroXService.isNecessaryToSetAllowance(necessaryAmount, this.tokenSold.address).then(this.checkNecessaryToSetAllowance);
  }

  isNecessaryToSetFeeAllowance () {
    if (this.isDestroyed) return;

    if (this.tokenSold.symbol === 'ZRX' || !this.feeAmount) {
      this.checkNecessaryToSetFeeAllowance({ needAllowance: false, currentAllowance: new BigNumber(0) });
    } else {
      this.zeroXService.getZeroXAddress().then(address => {
        this.zeroXService.isNecessaryToSetAllowance(this.feeAmount, address).then(this.checkNecessaryToSetFeeAllowance);
      })
    }
  }

  checkNecessaryToSetAllowance (result) {
    this.needToSetAllowance = result.needAllowance;
    this.updateNeedToSetAllowance(result.needAllowance);
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
    this.updateNeedToSetFeeAllowance(result.needAllowance);
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

  setAllowance () {
    if (this.isAuthorizing) {
      return;
    }
    this.isAuthorizing = true;
    this.updateLoadingState(true);
    const allowanceAmount = this.tokenSold.symbol !== 'ZRX' ? this.amount : this.amount.add(this.feeAmount);
    this.zeroXService.ensureAllowance(allowanceAmount, this.tokenSold.address).then(() => {
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
    this.zeroXService.getZeroXAddress().then(address => {
      this.zeroXService.ensureAllowance(new BigNumber(this.tokenSold.fee), address).then(() => {
        this.isNecessaryToSetFeeAllowance();
        this.updateLoadingState(false);
        this.isAuthorizingFee = false;
      }).catch((e) => {
        this.isAuthorizingFee = false;
        this.updateLoadingState(false);
        return e;
      });
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