<template>
    <tr class='table-order-item'>
        <td>{{takerSymbol}} <i class="fa fa-long-arrow-right" aria-hidden="true"></i> {{makerSymbol}}</td>
        <td>{{maxAmount}}</td>
        <td>1 : {{rate}}</td>
        <td>{{expiringDate}}</td>
        <td class="order-amount"><input v-model="order.valueRequired"/>
          <p v-if="error" class="error">{{error}}</p>
        </td>
        <td>
          <a class="btn-next-step-small" @click="chooseOrder()">CHOOSE ORDER</a>
        </td>
    </tr>
</template>

<script>
import { ZeroXService } from '../../api'
import { BigNumber } from 'bignumber.js'
import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'

Vue.use(AsyncComputed)

export default {
  data: function () {
    return {
      error: ''
    }
  },
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
    value: function () {
      return this.order.valueRequired
    }
  },
  asyncComputed: {
    makerSymbol () {
      var zeroXService = new ZeroXService()
      return zeroXService.getTokenSymbol(this.order.makerTokenAddress).then((response) => {
        return response
      }).catch(e => {
        alert(e)
      })
    },
    takerSymbol () {
      var zeroXService = new ZeroXService()
      return zeroXService.getTokenSymbol(this.order.takerTokenAddress).then((response) => {
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
      if (!this.order.valueRequired || this.order.valueRequired === '') {
        this.setError('You must insert a value')
        return;
      }
      try {
        var value = (new BigNumber(1000000000000000000)).mul(this.order.valueRequired);
        this.$emit('setTakerAmount', value);
      } catch (error) {
        this.setError('The value is not valid.')
        return;
      }

      this.$emit('chooseOrder', this.order)
    },
    setError (value) {
      this.error = value
    },
    onSuccess () {
      alert('Fill order successfully performed!!')
      this.$emit('onSuccessfullyFillOrder')
    }
  },
  watch: {
    'order.valueRequired': function (newValue) {
      if (newValue) {
        this.setError('')
      }
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
    font-size: 14px;
    color: #cccccc;
    text-align: center;
    border-color: #cccccc;
  }

  .order-amount {
    padding-top: 20px !important;
  }

  .order-amount input{
    background-color: rgba(119, 117, 144, 0.5);
    border-color: transparent;
    color: white;
    font-size: 14px;
    text-align: center;
  }

  a.btn-next-step-small, a:hover.btn-next-step-small{
    font-size: 14px;
    color: #ff6c72;
    text-transform: uppercase;
    font-weight: 500;
    cursor: pointer;
  }

  p.error{
    padding: 0px;
    margin: 0px;
    color: red;
    opacity: 0.9;
    font-size: 13px;
  }

  @media (max-width: 992px){
    .table-order-item td {
      font-size: 12px;
    }

    a.btn-next-step-small, a:hover.btn-next-step-small{
      font-size: 12px;
    }

    p.error{
      font-size: 11px;
    }

    .order-amount input{
      font-size: 11px;
    }
  }
</style>