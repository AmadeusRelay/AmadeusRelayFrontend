<template>
    <div class="col-md-12 bottom-space">
    <label>
        <span class="cb-validation" v-bind:class="{'active' : !needToWrapETH, 'inactive' :needToWrapETH}"></span> Convert ETH in WETH
        <div v-if='tokenSold.symbol==="ETH"'>
            <div class='item-details'>Converted: {{convertedAmount}} {{convertedToken}}</div>
            <a v-if='needToWrapETH && !needBalance' class="btn-action" @click="wrapETH()">Convert</a>
        </div>
        <div v-if='tokenSold.symbol!=="ETH"'>
            <div class='item-details'>The conversion is only applied to ETH token</div>
        </div>
    </label>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { ZeroXService } from '../../api'
import { BigNumber } from 'bignumber.js'
import { TokenInfo } from '../../model/tokeninfo'

@Component
export default class WrapEth extends Vue {
  needToWrapETH: boolean = true
  needBalance: boolean = true;
  convertedToken: string = '';
  convertedAmount: string = '';
  amount: BigNumber = new BigNumber(0);
  zeroXService: ZeroXService;
  isWrapping: boolean = false;
  tokenSold: TokenInfo = { symbol: '', address: '', fee: new BigNumber(0) };

  @Getter getTokenSold
  @Getter getTokenBought
  @Getter getFeeToPay
  @Getter getTokenSoldAmount
  @Getter getNeedBalance
  @Mutation updateLoadingState
  @Mutation updateNeedToWrapEth

  mounted () {
    this.zeroXService = new ZeroXService();
    this.amount = this.getTokenSoldAmount;
    this.tokenSold = this.getTokenSold;
    this.isNecessaryToWrapETH();
  }

  isNecessaryToWrapETH () {
    this.needBalance = this.getNeedBalance;
    if (this.tokenSold.symbol === 'ETH') {
      this.zeroXService.isNecessaryToWrapETH(this.amount, this.tokenSold.address).then(this.checkNecessaryToWrapETH);
      this.convertedToken = 'WETH';
    } else {
      this.needToWrapETH = false;
      this.updateNeedToWrapEth(false);
      this.convertedToken = this.tokenSold.symbol;
    }
  }

  checkNecessaryToWrapETH (result) {
    this.needToWrapETH = result.needWrap;
    this.updateNeedToWrapEth(result.needWrap);
    this.convertedAmount = result.currentWrapped.dividedBy(1000000000000000000).toFormat();
    if (this.needToWrapETH) {
      setTimeout(() => this.isNecessaryToWrapETH(), 2000);
    }
  }

  wrapETH () {
    debugger;
    if (this.isWrapping) {
      return;
    }
    this.isWrapping = true;
    this.updateLoadingState(true);
    this.zeroXService.wrapETH(this.amount, this.tokenSold.address).then(() => {
      this.isNecessaryToWrapETH();
      this.updateLoadingState(false);
      this.isWrapping = false;
    }).catch((e) => {
      this.isWrapping = false;
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