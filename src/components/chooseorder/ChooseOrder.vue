<template>
<div id="choose-order-section">
      <div class="container">
          <div class="row">
            <div class="col-md-12">
                <p>Our relay provide large signed orders according to the dApp needs, containing the tokens used, fees, amounts, etc. The dApp chooses an order and the amount to exchange.
<br>In our demo Api, the fee is set to 0%.</p>
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
import { Mutation } from 'vuex-class'
import { Component, Vue } from 'vue-property-decorator'
import OrdersList from './OrdersList.vue'
import { Order } from '../../model/order'
import { BigNumber } from 'bignumber.js'
import { Scripts } from '../../utils/scripts'

@Component({
  components: { 'orders-list': OrdersList }
})

export default class ChooseOrder extends Vue {
  @Mutation addCodeLine
  @Mutation changePage
  @Mutation selectOrder
  @Mutation updateTakerAmount

  goToFillOrderPage (order: Order) {
    this.selectOrder(order);
    this.changePage(4)
  }

  setTakerAmount (amount: BigNumber) {
    this.updateTakerAmount(amount);
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