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
            <a class="btn-next-step" @click="/*getTokenPairs();*/ goToGetOrdersPage()">GET TOKENS
              <img src="../../assets/arrow-right.svg"/>
            </a>
          </div>
        </div>
      </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import { Scripts } from '../../utils/scripts'

export default {
  name: 'token-pairs',
  methods: {
    ...mapMutations({
      addCodeLine: 'addCodeLine',
      updatePageId: 'changePage'
    }),
    goToGetOrdersPage () {
      this.updatePageId(2)
    }
  },
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
    font-size: 20px;
    color: #ffffff;
}
</style>