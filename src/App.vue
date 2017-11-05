<template>
    <div id="main-section">
      <div class="row" id="logo">
        <img src="http://amadeusrelay.org/img/logo_nome_transparente.png">
      </div>
      <br><br><br>
      <p class="text-center">Choose tokens to trade:</p>
      <div class="row">
        <div class="col-md-2"/>
        <div class="col-md-4">
          <tokens-list :token='token1' @update:token='val => token1 = val'/> 
        </div>
        <div class="col-md-4">
          <tokens-list :token='token2' @update:token='val => token2 = val'/>
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
import { OrderService } from './api'
import { Order } from './model/order'

@Component({
  name: 'App',
  components: {
    'tokens-list': TokensList,
    'orders-list': OrdersList
  }
})

export default class App extends Vue {
  token1: string = ''
  token2: string = ''
  orders: Order[] = []
  getOrders () {
    alert(`Token1: ${this.token1} | Token2: ${this.token2}`)
    var orderService : OrderService = new OrderService()
    orderService.listOrders(this.token1, this.token2).then(this.onSuccessfullyGetOrders)
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
  max-height: 626px;
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