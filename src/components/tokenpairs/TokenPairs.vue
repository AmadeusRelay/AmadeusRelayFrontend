<template>
<div id="token-pairs-section">
      <div class="container">
          <p>Through our API, the dApp can get the token pairs available at Amadeus using end point <b>GET token_pairs</b></p>
      </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'token-pairs',
  methods: {
    ...mapMutations({
      addCodeLine: 'addCodeLine'
    })
  },
  mounted () {
    this.addCodeLine('teste teste')
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