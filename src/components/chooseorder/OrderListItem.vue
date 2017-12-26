<template>
    <tr class='table-order-item'>
        <td>{{makerSymbol}} <i class="fa fa-long-arrow-right" aria-hidden="true"></i> {{takerSymbol}}</td>
        <td>{{maxAmount}}</td>
        <td>{{rate}} : 1</td>
        <td>{{expiringDate}}</td>
        <td class="order-amount"><input v-model="order.valueRequired"/></td>
        <td>
          <a class="btn-next-step-small" @click="chooseOrder()">CHOOSE ORDER
            <img src="../../assets/arrow-right.svg"/>
          </a>
        </td>
    </tr>
</template>

<script>
import { OrderService } from '../../api'
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
    chooseOrder () {
      this.$emit('chooseOrder', this.order)
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

  .table-order-item td {
    color: white;
    padding-top: 25px;
    padding-bottom: 20px;
    font-size: 18px;
    color: #cccccc;
    text-align: center;
    border-color: #cccccc;
  }

  .order-amount {
    padding-top: 20px !important;
  }

  .order-amount input{
    background-color: #76729f;
    border-color: transparent;
    color: white;
    font-size: 18px;
    text-align: center;
  }

  a.btn-next-step-small, a:hover.btn-next-step-small{
    font-size: 20px;
    color: #ff6c72;
    text-transform: uppercase;
    font-weight: 500;
    cursor: pointer;
  }
</style>