<template>
<div id="choose-order-section">
      <div class="container">
          <div class="row">
            <div class="col-md-12">
                <p>Our relay provides large signed orders according to the dApp needs, containing the tokens used, fees, amounts, etc. The dApp chooses an order and the amount to exchange.
<br>The fee is charging in ZRX.</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
                <orders-list @chooseOrder='goToFillOrderPage' @setTakerAmount='setTakerAmount'/>
            </div>
          </div>
        </div>
      </div>
</div>
</template>

<script lang="ts">
import { Getter, Mutation } from 'vuex-class'
import { Component, Vue } from 'vue-property-decorator'
import { ZeroXService } from '../../api'
import OrdersList from './OrdersList.vue'
import { Order } from '../../model/order'
import { TokenInfo } from '../../model/tokenInfo'
import { BigNumber } from 'bignumber.js'
import { Scripts } from '../../utils/scripts'

@Component({
  components: { 'orders-list': OrdersList }
})

export default class ChooseOrder extends Vue {
  hasToChangePage: boolean = false;
  @Getter getTokenSoldAmount
  @Mutation addCodeLine
  @Mutation changePage
  @Mutation selectOrder
  @Mutation updateTokenSoldAmount
  @Mutation updateTokenSold
  @Mutation updateTokenBought
  @Mutation updateFeeToPay
  @Mutation updateFeeUnit

  goToFillOrderPage (order: Order) {
    this.selectOrder(order);

    const zeroXService = new ZeroXService();
    zeroXService.getTokenByAddress(order.takerTokenAddress).then(token => this.setTokenSold(token, order));
    zeroXService.getTokenByAddress(order.makerTokenAddress).then(token => this.setTokenBought(token, order));
    zeroXService.getTokenUnitBySymbol('ZRX').then(unit => this.setFeeUnit(unit))

    this.setFeeToPay(order);
  }

  setTokenSold (token: TokenInfo, order: Order) {
    token.fee = new BigNumber(order.takerFee);
    this.updateTokenSold(token);
    this.changeToNextPage();
  }

  setTokenBought (token: TokenInfo, order: Order) {
    token.fee = new BigNumber(order.makerFee);
    this.updateTokenBought(token);
    this.changeToNextPage();
  }

  setFeeUnit (unit: BigNumber) {
    this.updateFeeUnit(unit);
  }

  changeToNextPage () {
    if (!this.hasToChangePage) {
      this.hasToChangePage = true;
    } else {
      this.changePage(5);
    }
  }

  setFeeToPay (order: Order) {
    let orderFee = new BigNumber(order.takerFee ? order.takerFee : '0');
    let feeAmount: BigNumber;
    if (orderFee.greaterThan(0)) {
      const orderTakerAmount = new BigNumber(order.takerTokenAmount);
      feeAmount = orderFee.mul(this.getTokenSoldAmount).dividedBy(orderTakerAmount);
    } else {
      feeAmount = null;
    }
    this.updateFeeToPay(feeAmount);
  }

  setTakerAmount (amount: BigNumber) {
    this.updateTokenSoldAmount(amount);
  }

  mounted () {
    this.addCodeLine(new Scripts().chooseOrder);
  }
}
</script>

<style scoped>
#choose-order-section .container {
    padding-top: 130px;
}

#choose-order-section .container p{
    font-size: 21px;
    color: #ffffff;
    font-weight: 300;
}

#choose-order-section .container p b{
    font-weight: 400;
}

@media (max-width: 992px){
  #choose-order-section .container p{
    font-size: 19px;
  }

  #choose-order-section .container {
    padding-top: 20%;
  }
}
</style>