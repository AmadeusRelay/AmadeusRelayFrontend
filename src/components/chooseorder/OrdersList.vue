<template>
  <scroll-bar class="scroll-area"> 
    <div class="form-group table-order">
        <table class="table table-striped table-condensed">
            <thead class="table-order-head">
                <tr>
                <th><tr>Transaction</tr><tr>Maker <i class="fa fa-long-arrow-right" aria-hidden="true"></i> Taker</tr></th>
                <th>Max Amount</th>
                <th>Rate</th>
                <th>Expiration Date</th>
                <th>Taker Amount</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
               <order-list-item v-for="order in ordersList" :order="order" :key="order.salt" @chooseOrder='chooseOrder(order)' @setTakerAmount='setTakerAmount'></order-list-item>
            </tbody>
        </table>
    </div>
    </scroll-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Order } from '../../model/order'
import OrderListItem from './OrderListItem.vue'
import { Getter } from 'vuex-class'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

@Component({
  components: {
    'order-list-item': OrderListItem,
    'scroll-bar': VuePerfectScrollbar
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
  padding-bottom: 15px;
  font-size: 14px;
  text-align: center;
  border-color: #cccccc;
  border-top: 0px;
  font-weight: 400;
}

.table-order {
  height: auto; 
  overflow: auto;
}

.scroll-area {
  position: relative;
  margin: auto;
  height: -moz-calc(100vh - 400px);
  height: -webkit-calc(100vh - 400px);
  height: calc(100vh - 400px);
}
</style>