<template>
    <tr>
        <td>{{makerSymbol}}</td>
        <td>{{takerSymbol}}</td>
        <td><input v-model="order.valueRequired"/></td>
        <td><button @click="fillOrder()" class="js-add btn btn-primary btn-block" type="button">Fill Order!</button></td>
    </tr>
</template>

<script>
import { OrderService } from '../api'

export default {
  props: {
    order: Object
  },
  data () {
    return {
      makerSymbol: null,
      takerSymbol: null
    }
  },
  created () {
    this.getMakerSymbol()
    this.getTakerSymbol()
  },
  methods: {
    getMakerSymbol () {
      var orderService = new OrderService()
      orderService.getTokenSymbol(this.order.makerTokenAddress).then((response) => {
        this.makerSymbol = response
      }).catch(e => {
        alert(e)
      })
    },
    getTakerSymbol () {
      var orderService = new OrderService()
      orderService.getTokenSymbol(this.order.takerTokenAddress).then((response) => {
        this.takerSymbol = response
      }).catch(e => {
        alert(e)
      })
    },
    fillOrder () {
      var orderService = new OrderService()
      orderService.fillOrder(this.order, this.order.valueRequired).then(() => {
        this.onSuccess()
      }).catch(e => {
        alert(e)
      })
    },
    onSuccess () {
      this.$emit('onSuccessfullyFillOrder')
    }
  }
}
</script>