<template>
    <div class="form-group table-order">
        <table class="table table-striped table-condensed">
            <thead class="table-order-head">
                <tr>
                <th>Transaction</th>
                <th>Max Amount</th>
                <th>Rate</th>
                <th>Expiration Date</th>
                <th>Value Required</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
               <order-list-item v-for="order in ordersList" :order="order" :key="order.salt" @chooseOrder='chooseOrder(order)' @setTakerAmount='setTakerAmount'></order-list-item>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Order } from '../../model/order'
import OrderListItem from './OrderListItem.vue'
import { Getter } from 'vuex-class'

@Component({
  components: {
    'order-list-item': OrderListItem
  }
})

export default class OrdersList extends Vue {
  @Getter getOrders

  ordersList: Order[] = []

  mounted () {
    this.ordersList = this.getOrders;
  }

  chooseOrder (order: any) {
    this.$emit('chooseOrder', order);
  }

  setTakerAmount (amount: any) {
    this.$emit('setTakerAmount', amount);
  }
}
</script>

<style scoped>

.table-order-head th {
  color: white;
  padding-top: 30px;
  padding-bottom: 30px;
  font-size: 18px;
  text-align: center;
  border-color: #cccccc;
  border-top: 0px;
}

.table-order {
  height: -moz-calc(100vh - 400px);
  height: -webkit-calc(100vh - 400px);
  height: calc(100vh - 400px);
  overflow: auto;
}

</style>