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
                <td><input v-value="order.valueRequired"/></td>
                <td><button @click="fillOrder" class="js-add btn btn-primary btn-block" type="button">Fill Order!</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Order } from '../model/order'

@Component
export default class OrderList extends Vue {
  @Prop()
  ordersList: Order[]
}
</script>