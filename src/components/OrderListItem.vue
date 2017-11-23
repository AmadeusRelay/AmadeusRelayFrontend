<template>
    <tr>
        <td>{{makerSymbol}} <i class="fa fa-long-arrow-right" aria-hidden="true"></i> {{takerSymbol}}</td>
        <td>{{maxAmount}}</td>
        <td>{{rate}} : 1</td>
        <td>{{expiringDate}}</td>
        <td><input v-model="order.valueRequired"/></td>
        <td><a @click="fillOrder()" class="btn btn-link">Fill Order!</a></td>
    </tr>
</template>

<script>
import { OrderService } from '../api'
import { BigNumber } from 'bignumber.js'

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
    this.setMakerSymbol()
    this.setTakerSymbol()
  },
  computed: {
    expiringDate: function () {
      return this.getOrderExpiringDate()
    },
    maxAmount: function () {
      return this.getMaxAmount()
    },
    rate: function() {
        return this.getRate()
    }
  },
  methods: {
    setMakerSymbol () {
      var orderService = new OrderService()
      orderService.getTokenSymbol(this.order.makerTokenAddress).then((response) => {
        this.makerSymbol = response
      }).catch(e => {
        alert(e)
      })
    },
    setTakerSymbol () {
      var orderService = new OrderService()
      orderService.getTokenSymbol(this.order.takerTokenAddress).then((response) => {
        this.takerSymbol = response
      }).catch(e => {
        alert(e)
      })
    },
    getRate () {
      var makerAmount = new BigNumber(this.order.makerTokenAmount)
      var takerAmount = new BigNumber(this.order.takerTokenAmount)
      return makerAmount.dividedBy(takerAmount).toFormat()
    },
    getOrderExpiringDate () {
      var date = new Date(this.order.expirationUnixTimestampSec * 1000)
      var day = date.getDate()
      var month = date.getMonth() + 1
      var year = date.getFullYear()
      var hours = date.getHours()
      var minutes = date.getMinutes()
      var seconds = date.getSeconds()
      return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds
    },
    getMaxAmount () {
      var makerAmount = new BigNumber(this.order.takerTokenAmount)
      var conv = new BigNumber(100000000000000000)
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