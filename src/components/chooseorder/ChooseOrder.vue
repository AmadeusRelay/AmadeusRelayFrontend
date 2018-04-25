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

  goToFillOrderPage (order: Order) {
    this.selectOrder(order);

    const zeroXService = new ZeroXService();
    zeroXService.getTokenSymbol(order.takerTokenAddress).then(symbol => this.setTokenSold(symbol, order));
    zeroXService.getTokenSymbol(order.makerTokenAddress).then(symbol => this.setTokenBought(symbol, order));

    this.setFeeToPay(order);
  }

  setTokenSold (symbol: string, order: Order) {
    this.updateTokenSold({
      symbol: symbol,
      address: order.takerTokenAddress,
      fee: order.takerFee
    });
    this.changeToNextPage();
  }

  setTokenBought (symbol: string, order: Order) {
    this.updateTokenBought({
      symbol: symbol,
      address: order.makerTokenAddress,
      fee: order.makerFee
    });
    this.changeToNextPage();
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