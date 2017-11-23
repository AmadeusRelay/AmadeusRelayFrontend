<template>
    <div class="form-group">
        <table class="table table-bordered table-striped table-condensed">
            <thead>
                <tr>
                <th>Transaction</th>
                <th>Max Amount</th>
                <th>Expiration Date</th>
                <th>Value Required</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
               <orders-list-item v-for="order in ordersList" :order="order"></orders-list-item>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Order } from '../model/order'
import OrdersListItem from './OrderListItem.vue'

@Component({
  components: {
    'orders-list-item': OrdersListItem
  }
})

export default class OrderList extends Vue {
  @Prop()
  ordersList: Order[]
}
</script>