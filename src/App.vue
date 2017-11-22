<template>
    <div id="main-section">
      <div class="row" id="logo">
        <img src="http://amadeusrelay.org/img/logo_nome_transparente.png">
      </div>
      <br><br><br>
      <p class="text-center">Choose tokens to trade:</p>
      <div class="row">
        <div class="col-md-2"/>
        <div class="col-md-3">
          <tokens-list :token='token1' :tokenAIsSelected='true' @update:token='updateToken1'/> 
        </div>
        <div class="col-md-3">
          <tokens-list :token='token2':tokenAIsSelected='token1' ref="tokenB" @update:token='val => token2 = val'/>
        </div> 
        <div class="col-md-2">
          <button @click="getOrders" class="js-add btn btn-primary btn-block" 
              type="button">Get Orders!</button> 
        </div>
      </div>
      <br><br>
      <div class="row">
        <div class="col-md-2"/>
        <div class="col-md-8">
          <orders-list :ordersList='orders' @onSuccessfullyFillOrder='onSuccessfullyFillOrder'/>
        </div>    
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TokensList from './components/TokensList.vue'
import OrdersList from './components/OrdersList.vue'
import OrdersListItem from './components/OrderListItem.vue'
import { OrderService } from './api'
import { Order } from './model/order'

@Component({
  name: 'App',
  components: {
    'tokens-list': TokensList,
    'orders-list': OrdersList,
    'orders-list-item': OrdersListItem
  }
})

export default class App extends Vue {
  $refs: {
    tokenB: TokensList
  }

  token1: string = ''
  token2: string = ''
  orders: Order[] = []
  getOrders () {
    var orderService : OrderService = new OrderService()
    orderService.listOrders(this.token1, this.token2).then(this.onSuccessfullyGetOrders)
  }
  updateToken1 (value) {
    this.token1 = value
    this.$refs.tokenB.getTokenPairs(this.token1)
  }
  onSuccessfullyGetOrders (response: any) {
    this.orders = response
  }
  onSuccessfullyFillOrder () {
    alert('Fill completed with success!')
    this.getOrders()
  }
}
</script>

<style scoped>
#main-section{
  color: #FFFFFF;
  text-align: center;
  background-position: 50% 50%;
  background-size: cover;
  overflow: hidden;
}

#logo {
  text-align: center;
  color: #2c3e50;
  display: block;
  margin-top: 60px;
  margin-left: auto;
  margin-right: auto;
}
</style>