<template>
<div id="token-pairs-section">
  <div class="container">
    <div class="row">
        <div class="col-md-12">
          <p>You can interact with Amadeus Relay using our <a class="external-links" target="_blank" href="http://api.amadeusrelay.org/api-docs/">Rest API</a> or the <a class="external-links" target="_blank" href="https://0xproject.com/docs/connect">0xConnect</a> library.</p>
      </div>
    </div>
    <div class="row">
        <div class="col-md-12">
          <p>Through our API, the dApp can get the token pairs available at Amadeus using endpoint <b>GET /token_pairs</b></p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <a class="btn-next-step" @click="getTokenPairs()">GET TOKENS PAIRS
          <img src="../../assets/arrow-right.svg"/>
        </a>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Scripts } from '../../utils/scripts'
import { OrderService, ZeroXService, BuildOrderService } from '../../api'
import { Mutation } from 'vuex-class'

@Component
export default class TokenPairs extends Vue {
  @Mutation addCodeLine
  @Mutation changePage
  @Mutation updateTokenPairs
  @Mutation updateLoadingState

  getTokenPairs () {
    var orderService : OrderService = new OrderService(new ZeroXService(), new BuildOrderService())
    this.updateLoadingState(true)
    orderService.getTokenPairs().then(this.onSuccessfullyGetTokenPairs)
  }

  onSuccessfullyGetTokenPairs (tokenPairs: any) {
    this.updateTokenPairs(tokenPairs)
    this.updateLoadingState(false)
    this.goToNextPage()
  }

  goToNextPage () {
    this.changePage(3)
  }

  mounted () {
    this.addCodeLine(new Scripts().getTokenPairs)
  }
}
</script>

<style scoped>
#token-pairs-section .container {
    padding-top: 180px;
}

#token-pairs-section .container p{
    font-size: 22px;
    color: #ffffff;
    font-weight: 300;
}

#token-pairs-section .container p b{
    font-weight: 400;
}

#token-pairs-section a.external-links{
  color: #ff6c72;
  cursor: pointer;
  opacity: 0.7;
}

@media (max-width: 992px){
  #token-pairs-section .container {
    padding-top: 25%;
  }

  #token-pairs-section .container p{
    font-size: 20px;
  }
}
</style>