<template>
<div id="get-price-section">
      <div class="container">
          <div class="row">
            <div class="col-md-12">
                <p>Amadeus returns an array of tokens, combined in pairs. Then the dApp can consult out price using the endpoint <b>GET prices</b>.</p>
            </div>
          </div>
          <div class="row">
              <div class="col-md-4">
              <label>Maker token (to sell)</label>
              <tokens-list :token='makerToken' ref="makerTokenRef" @updateToken='updateMakerToken'/>
            </div>
            <div class="col-md-4">
              <label>Taker token (to buy)</label>
              <tokens-list :token='takerToken' ref='takerTokenRef' @updateToken='updateTakerToken'/> 
            </div>
          </div> 
          <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToGetPricePage()" v-bind:class="{'inactive': !enablePriceButton}">GET PRICE
                <img src="../../assets/arrow-right.svg"/>
                </a>
            </div>
        </div>
      </div>
</div>
</template>


<script lang="ts">
import TokensList from './../getorders/TokensList.vue'
import { Component, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import { OrderService, ZeroXService, BuildOrderService } from '../../api'
import { Scripts } from '../../utils/scripts'

@Component({
  components: { 'tokens-list': TokensList }
})
export default class GetPrice extends Vue {
  takerToken: string = ''
  makerToken: string = ''
  enablePriceButton: boolean = false

  $refs: {
    makerTokenRef: TokensList,
    takerTokenRef: TokensList
  }

  @Mutation addCodeLine
  @Mutation changePage
  @Mutation updatePrice
  @Mutation updateLoadingState
  @Mutation updateErrorModel
  @Mutation updateErrorMessage

  goToGetPricePage () {
    if (this.enablePriceButton) {
      var orderService : OrderService = new OrderService(new ZeroXService(), new BuildOrderService());
      var zeroXService = new ZeroXService();
      this.updateLoadingState(true)
      orderService.getPrice(this.takerToken, this.makerToken, zeroXService.getCoinBase()).then(this.onSuccessfullyGetPrice).catch((e) => {
        this.updateErrorModel(e);
        this.updateLoadingState(false)
      });
    }
  }

  onSuccessfullyGetPrice (price: any) {
    if (price === null) {
      this.updateErrorMessage('Pair not supported')
      this.updateLoadingState(false)
    } else {
      this.updatePrice(price);
      this.updateLoadingState(false)
      this.changePage(4);
    }
  }

  updateTakerToken (value : string) {
    this.takerToken = value
    this.$refs.makerTokenRef.refreshToken(this.takerToken, false)
    this.validateFields()
  }

  updateMakerToken (value : string) {
    this.makerToken = value
    this.$refs.takerTokenRef.refreshToken(this.makerToken, true)
    this.validateFields()
  }

  validateFields () {
    if (this.makerToken !== '' && this.takerToken !== '') {
      this.enablePriceButton = true
    } else {
      this.enablePriceButton = false
    }
  }

  mounted () {
    this.addCodeLine(new Scripts().getOrders);
    this.$refs.makerTokenRef.refreshToken(this.takerToken, false)
    this.$refs.takerTokenRef.refreshToken(this.makerToken, true)
  }
}
</script>

<style scoped>
#get-price-section .container {
    padding-top: 130px;
}

#get-price-section .container p{
    font-size: 22px;
    color: #ffffff;
    font-weight: 300;
}

#get-price-section .container p b{
    font-weight: 400;
}

#get-price-section label{
    color: #ffffff;
    font-size: 17px;
}

#get-price-section .btn-next-step.inactive{
  opacity: 0.5;
  cursor: default;
}

@media (max-width: 992px){
  #get-price-section .container p{
    font-size: 20px;
  }
}
</style>