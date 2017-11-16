<template>
    <div class="form-group">
        <table class="table table-bordered table-striped table-condensed">
            <thead>
                <tr>
                <th>Maker</th>
                <th>Taker</th>
                <th>Value Required</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in ordersList">
                <td>{{order.maker}}</td>
                <td>{{order.taker}}</td>
                <td><input v-model="order.valueRequired"/></td>
                <td><button @click="fillOrder(order)" class="js-add btn btn-primary btn-block" type="button">Fill Order!</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Order } from '../model/order'
import { OrderService } from '../api'

@Component
export default class OrderList extends Vue {
  @Prop()
  ordersList: Order[]

  fillOrder (order: Order) {
    var orderService : OrderService = new OrderService()
    orderService.fillOrder(order, order.valueRequired).then(() => {
      this.onSuccess()
    }).catch(e => {
      alert(e)
    })
  }
  onSuccess () {
    this.$emit('onSuccessfullyFillOrder')
  }
}
</script>