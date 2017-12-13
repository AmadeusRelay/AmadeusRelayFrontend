<template>
<div id="welcome-section">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h2>Welcome to our demo!</h2>
        </div>
        <div class="col-md-12">
          <p>In this demo we will walk you through how our API works and how you can integrate it with your dApp. In order to properly use all its funcionalities, you need to:</p>
        </div>
        <div class="col-md-6">
          <button class="js-add btn btn-block uppercase" type="button" @click="goToTokenPairsPage()">Documentation</button>
        </div>
        <div class="col-md-6">
          <button class="js-add btn btn-block uppercase" type="button" @click="goToTokenPairsPage()">Let's Go</button>
        </div>
      </div>
    </div>
</div> 
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'welcome',
  methods: {
    ...mapMutations({
      updatePageId: 'changePage'
    }),
    goToTokenPairsPage () {
      this.updatePageId(1)
    }
  }
}
</script>

<style scoped>
#welcome-section .container {
    padding-top: 120px;
    padding-right: 160px;
    text-align: center;
    color: white;
}

#welcome-section .container p{
    font-size: 20px;
}
</style>