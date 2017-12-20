<template>
<div id="get-orders-section">
      <div class="container">
          <div class="row">
            <div class="col-md-12">
                <p>Amadeus returns an array of tokens, combined in pairs. Then the dApp choose which tokens to trade using end point <b>GET orders</b>.</p>
            </div>
          </div>
          <div class="col-md-3">
            <tokens-list :token='tokenA' :tokenAIsSelected='true' @update:token='val => tokenA = val'/> 
          </div>
          <div class="col-md-3">
            <tokens-list :token='tokenB':tokenAIsSelected='tokenA' ref="tokenRef" @update:token='val => tokenB = val'/>
          </div> 
          <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToChooseOrdersPage()">GET ORDERS
                <img src="../../assets/arrow-right.svg"/>
                </a>
            </div>
        </div>
      </div>
</div>
</template>


<script lang="ts">
import TokensList from './TokensList.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

@Component({
  components: { 'tokens-list': TokensList }
})

@Component
export default class GetOrders extends Vue {
  $refs: {
    tokenRef: TokensList
  }

  tokenA: string = ''
  tokenB: string = ''

  @Mutation addCodeLine
  @Mutation changePage

  goToChooseOrdersPage () {
    this.changePage(3)
  }

  @Watch('tokenA')
  onPropertyChanged (value: string, oldValue: string) {
    debugger
    this.$refs.tokenRef.refreshToken(this.tokenA)
  }

  mounted () {
    this.addCodeLine('teste teste')
  }
}
</script>

<style scoped>
#get-orders-section .container {
    padding-top: 130px;
}

#get-orders-section .container p{
    font-size: 22px;
    color: #ffffff;
    font-weight: 300;
}

#get-orders-section .container p b{
    font-weight: 400;
}
</style>