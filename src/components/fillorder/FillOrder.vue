<template>
<div id="fill-order-section">
      <div class="container">
          <div class="row">
            <div class="col-md-12">
                <p>In order to be able to fill your chosen order, you need to: </p>
            </div>
          </div>
          <div class="row">
            <input type="checkbox" :value="!needToWrapETH" :disabled="!needToWrapETH" @click="wrapETH"><span class="span-checkbox">Convert ETH in WETH</span></input>
          </div>
          <div class="row">
            <input type="checkbox" :value="!needToSetAllowance" :disabled="!needToSetAllowance" @click="setAllowance"><span class="span-checkbox">Authorize 0x to interact with your funds</span></input>
          </div>
          <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToFinalPage()">FILL ORDER
                <img src="../../assets/arrow-right.svg"/>
                </a>
            </div>
        </div>
      </div>
</div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import { OrderService } from '../../api'
import { BigNumber } from 'bignumber.js'

@Component
export default class FillOrder extends Vue {
  needToWrapETH: boolean = true
  needToSetAllowance: boolean = true

  @Mutation addCodeLine
  @Mutation changePage

  goToFinalPage () {
    this.changePage(5)
  }

  mounted () {
    this.addCodeLine('teste teste')
    this.isNecessaryToWrapETH()
    this.isNecessaryToSetAllowance()
  }

  isNecessaryToWrapETH () {
    var orderService : OrderService = new OrderService()
    orderService.isNecessaryToWrapETH(this.amount, this.takerAddress).then(this.checkNecessaryToWrapETH)
  }

  isNecessaryToSetAllowance () {
    var orderService : OrderService = new OrderService()
    orderService.isNecessaryToSetAllowance(this.amount, this.takerAddress).then(this.checkNecessaryToSetAllowance)
  }

  checkNecessaryToWrapETH (result) {
    this.needToWrapETH = result
  }

  checkNecessaryToSetAllowance (result) {
    this.needToSetAllowance = result
  }

  wrapETH () {
    var orderService : OrderService = new OrderService()
    orderService.wrapETH(this.amount, this.takerAddress).then(this.checkNecessaryToWrapETH)
  }

  setAllowance () {
    var orderService : OrderService = new OrderService()
    orderService.ensureAllowance(this.amount, this.takerAddress).then(this.checkNecessaryToSetAllowance)
  }

  @Prop()
  takerAddress: string
  @Prop()
  amount: BigNumber
}
</script>

<style scoped>
#fill-order-section .container {
    padding-top: 130px;
}

#fill-order-section .container p, input[type="checkbox"] span{
    font-size: 22px;
    color: #ffffff;
    font-weight: 300;
}

#fill-order-section .container p b{
    font-weight: 400;
}

span.span-checkbox{
    font-size: 18px;
    color: #ffffff;
    font-weight: 300;
}
</style>