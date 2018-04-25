<template>
<div id="fill-order-section">
      <div class="container">
          <div class="row">
            <div v-if='takerAmount && makerAmount' class="col-md-12">
                <p>Chosen order: {{takerAmount.dividedBy(1000000000000000000).toFormat()}} {{tokenSold.symbol}} <i class="fa fa-long-arrow-right" aria-hidden="true"></i> {{makerAmount.dividedBy(1000000000000000000).toFormat()}} {{tokenBought.symbol}} {{feeAmount ? (' / Fee: ' + feeAmount.dividedBy(1000000000000000000).toFormat() + ' ZRX') :''}}
                <br>In order to be able to fill the order, you need to: </p>
            </div>
          </div>
          <div class="row">
            <sufficient-balance/>
            <wrap-eth/>
            <set-allowance/>
          </div>
          <div class="row">
            <div class="col-md-12">
                <p>The dApp fills its address as taker address, the taker desired amount and calls <b>fillOrder</b> to complete the order. </p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToFinalPage()" v-bind:class="{'inactive': getNeedBalance || getNeedToWrapEth || getNeedToSetAllowance || getNeedFeeBalance || getNeedToSetFeeAllowance}">FILL ORDER
                <img src="../../assets/arrow-right.svg"/>
                </a>
            </div>
        </div>
      </div>
</div>
</template>


<script lang="ts">
import SufficientBalance from './SufficientBalance.vue'
import WrapEth from './WrapEth.vue'
import SetAllowance from './SetAllowance.vue'
import { Component, Vue } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { ZeroXService } from '../../api'
import { BigNumber } from 'bignumber.js'
import { Order } from '../../model/order'
import { TokenInfo } from '../../model/tokeninfo'
import { Scripts } from '../../utils/scripts'

@Component({
  components:
  {
    'sufficient-balance': SufficientBalance,
    'wrap-eth': WrapEth,
    'set-allowance': SetAllowance
  }
})
export default class FillOrder extends Vue {
  order: Order;
  takerAmount: BigNumber = new BigNumber(0);
  makerAmount: BigNumber = new BigNumber(0);
  feeAmount: BigNumber = null;
  zeroXService: ZeroXService;
  isFilling: boolean = false;
  tokenSold: TokenInfo = { symbol: '', address: '', fee: new BigNumber(0) };
  tokenBought: TokenInfo = { symbol: '', address: '', fee: new BigNumber(0) };

  @Getter getSelectedOrder
  @Getter getTokenSoldAmount
  @Getter getFeeToPay
  @Getter getNeedToSetFeeAllowance
  @Getter getNeedToSetAllowance
  @Getter getNeedBalance
  @Getter getNeedFeeBalance
  @Getter getNeedToWrapEth
  @Getter getTokenSold
  @Getter getTokenBought
  @Mutation addCodeLine
  @Mutation changePage
  @Mutation updateErrorMessage
  @Mutation updateLoadingState

  mounted () {
    this.zeroXService = new ZeroXService();
    this.order = this.getSelectedOrder;
    this.takerAmount = this.getTokenSoldAmount;
    this.feeAmount = this.getFeeToPay;
    this.makerAmount = new BigNumber(this.getTokenSoldAmount).mul(this.order.takerTokenAmount).dividedBy(this.order.makerTokenAmount);
    this.tokenSold = this.getTokenSold;
    this.tokenBought = this.getTokenBought;
    this.addCodeLine(new Scripts().fillOrder);
  }

  goToFinalPage () {
    if (this.getNeedToWrapEth || this.getNeedToSetAllowance || this.getNeedBalance || this.isFilling || this.getNeedFeeBalance || this.getNeedToSetFeeAllowance) {
      return;
    }
    this.isFilling = true;
    this.updateLoadingState(true)
    this.zeroXService.fillOrder(this.order, this.takerAmount).then(this.onSuccessfullyFillOrder).catch((e) => {
      this.updateErrorMessage(e.message);
      this.updateLoadingState(false)
      this.changePage(7);
    });
  }

  onSuccessfullyFillOrder () {
    this.updateLoadingState(false)
    this.changePage(6)
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