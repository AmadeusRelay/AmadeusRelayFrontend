<template>
<div id="choose-order-section">
      <div class="container">
          <div class="row">
            <div class="col-md-12">
                <p>Amadeus returns an array of tokens, combined in pairs. Then the dApp choose which tokens to trade using end point <b>GET orders</b>.</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <orders-list @chooseOrder='goToFillOrderPage'/>
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

@Component({
  components: { 'orders-list': OrdersList }
})

export default class ChooseOrder extends Vue {
  @Mutation addCodeLine
  @Mutation changePage
  @Mutation selectOrder

  goToFillOrderPage (order: Order) {
    this.selectOrder(order);
    this.changePage(4)
  }

  mounted () {
    this.addCodeLine('teste teste')
  }
}
</script>

<style scoped>
#choose-order-section .container {
    padding-top: 130px;
}

#choose-order-section .container p{
    font-size: 22px;
    color: #ffffff;
    font-weight: 300;
}

#choose-order-section .container p b{
    font-weight: 400;
}
</style>