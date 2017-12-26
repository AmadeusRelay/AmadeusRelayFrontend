<template>
<div id="get-orders-section">
      <div class="container">
          <div class="row">
            <div class="col-md-12">
                <p>Amadeus returns an array of tokens, combined in pairs. Then the dApp choose which tokens to trade using end point <b>GET orders</b>.</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <tokens-list :token='tokenA':tokenAIsSelected='true' @updateToken='updateTokenA'/> 
            </div>
            <div class="col-md-4">
              <tokens-list :token='tokenB':tokenAIsSelected='tokenA' ref="tokenRef" @updateToken='val => tokenB = val'/>
            </div>
          </div> 
          <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToChooseOrdersPage()">GET ORDERS
                <img src="../../assets/arrow-right.svg"/>
                </a>
            </div>
        </div>
      </div>
</div>
</template>


<script lang="ts">
import TokensList from './TokensList.vue'
import { Component, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import { OrderService } from '../../api'

@Component({
  components: { 'tokens-list': TokensList }
})
export default class GetOrders extends Vue {
  tokenA: string = ''
  tokenB: string = ''

  $refs: {
    tokenRef: TokensList
  }

  @Mutation addCodeLine
  @Mutation changePage
  @Mutation updateOrders

  goToChooseOrdersPage () {
    var orderService : OrderService = new OrderService();
    orderService.listOrders(this.tokenA, this.tokenB).then(this.onSuccessfullyListOrders);
  }

  onSuccessfullyListOrders (orders: any) {
    this.updateOrders(orders);
    this.changePage(3);
  }

  updateTokenA (value : string) {
    this.tokenA = value
    this.$refs.tokenRef.refreshToken(this.tokenA)
    if (!this.tokenA) {
      this.tokenB = ''
    }
  }

  mounted () {
    this.addCodeLine('teste teste')
  }
}
</script>

<style scoped>
#get-orders-section .container {
    padding-top: 130px;
}

#get-orders-section .container p{
    font-size: 22px;
    color: #ffffff;
    font-weight: 300;
}

#get-orders-section .container p b{
    font-weight: 400;
}
</style>