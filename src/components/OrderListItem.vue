<template>
    <tr>
        <td>{{makerSymbol}} <i class="fa fa-long-arrow-right" aria-hidden="true"></i> {{takerSymbol}}</td>
        <td>{{maxAmount}}</td>
        <td>{{rate}} : 1</td>
        <td>{{fee}}</td>
        <td>{{expiringDate}}</td>
        <td><input v-model="order.valueRequired"/></td>
        <td><a @click="fillOrder()" class="btn btn-link">Fill Order!</a></td>
    </tr>
</template>

<script>
import { OrderService } from '../api'
import { BigNumber } from 'bignumber.js'
import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'

Vue.use(AsyncComputed)

export default {
  props: {
    order: Object
  },
  computed: {
    expiringDate: function () {
      return this.getOrderExpiringDate()
    },
    maxAmount: function () {
      return this.getMaxAmount()
    },
    rate: function () {
      return this.getRate()
    },
    fee: function () {
      return this.takerFee
    }
  },
  asyncComputed: {
    makerSymbol () {
      var orderService = new OrderService()
      return orderService.getTokenSymbol(this.order.makerTokenAddress).then((response) => {
        return response
      }).catch(e => {
        alert(e)
      })
    },
    takerSymbol () {
      var orderService = new OrderService()
      return orderService.getTokenSymbol(this.order.takerTokenAddress).then((response) => {
        return response
      }).catch(e => {
        alert(e)
      })
    }
  },
  methods: {
    getRate () {
      var makerAmount = new BigNumber(this.order.makerTokenAmount)
      var takerAmount = new BigNumber(this.order.takerTokenAmount)
      return makerAmount.dividedBy(takerAmount).toFormat()
    },
    getOrderExpiringDate () {
      var date = new Date(this.order.expirationUnixTimestampSec * 1000)
      var day = ('0' + date.getDate()).slice(-2)
      var month = ('0' + (date.getMonth() + 1)).slice(-2)
      var year = date.getFullYear()
      var hours = ('0' + date.getHours()).slice(-2)
      var minutes = ('0' + date.getMinutes()).slice(-2)
      var seconds = ('0' + date.getSeconds()).slice(-2)
      return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds
    },
    getMaxAmount () {
      var makerAmount = new BigNumber(this.order.takerTokenAmount)
      var conv = new BigNumber(1000000000000000000)
      BigNumber.set({ DECIMAL_PLACES: 5 })
      return makerAmount.dividedBy(conv).toFormat()
    },
    fillOrder () {
      var orderService = new OrderService()
      var amount = new BigNumber(this.order.valueRequired)
      amount = amount.mul(1000000000000000000)
      orderService.fillOrder(this.order, amount).then(() => {
        this.onSuccess()
      }).catch(e => {
        alert(e)
      })
    },
    onSuccess () {
      alert('Fill order successfully performed!!')
      this.$emit('onSuccessfullyFillOrder')
    }
  }
}
</script>

<style scoped>
a.btn-link{
  cursor: pointer;
  color: #a09fac;
  font-weight: bold;
}

a.btn-link:hover{
  color: #bc5585;
}
</style>