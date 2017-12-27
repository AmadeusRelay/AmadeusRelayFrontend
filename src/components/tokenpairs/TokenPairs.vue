<template>
<div id="token-pairs-section">
      <div class="container">
        <div class="row">
            <div class="col-md-12">
              <p>Through our API, the dApp can get the token pairs available at Amadeus using end point <b>GET token_pairs</b></p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <a class="btn-next-step" @click="getTokenPairs()">GET TOKENS
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
import { OrderService, ZeroXService } from '../../api'
import { Mutation } from 'vuex-class'

@Component
export default class TokenPairs extends Vue {
  @Mutation addCodeLine
  @Mutation changePage
  @Mutation updateTokenPairs

  getTokenPairs () {
    var orderService : OrderService = new OrderService(new ZeroXService())
    orderService.getTokenPairs().then(this.onSuccessfullyGetTokenPairs)
  }

  onSuccessfullyGetTokenPairs (tokenPairs: any) {
    this.updateTokenPairs(tokenPairs)
    this.goToGetOrdersPage()
  }

  goToGetOrdersPage () {
    this.changePage(2)
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
</style>