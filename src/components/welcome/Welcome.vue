<template>
<div id="welcome-section">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h2>Welcome to our demo!</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <p class="subtitle">In this demo we will walk you through how our API works and how you can integrate it with your dApp. In order to properly use all its funcionalities, you need to:</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <label>
            <span class="cb-validation"></span> Have Metamask installed in your browser
          </label>
        </div>
        <div class="col-md-12">
        <label>
          <span class="cb-validation"></span> Login into your Metamask account
        </label>
        </div>
        <div class="col-md-12">
          <label>
            <span class="cb-validation"></span> Connect Metamast to Kovan test network
          </label>
        </div>       
      </div>
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-3">
          <button class="js-add btn btn-block btn-documentation" type="button" @click="goToTokenPairsPage()">DOCUMENTATION</button>
        </div>
        <div class="col-md-3">
          <button class="js-add btn btn-block btn-start-demo" type="button" @click="goToTokenPairsPage()">LET'S GO!</button>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4">
          <div class="line"></div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
        <p>If you don’t have any money in your wallet, you can get some using a Kovan faucet: 
            <a href="https://github.com/kovan-testnet/faucet">https://github.com/kovan-testnet/faucet</a></p>
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

#welcome-section h2 {
    font-weight: 300;
}

#welcome-section p.subtitle {
    font-weight: 300;
    font-size: 18px;
}


#welcome-section .container p{
    font-size: 20px;
}

#welcome-section .line{
  margin-top: 50px;
  margin-bottom: 50px;
  border: solid 1px #a09fac;
  background-color: #a09fac;
  height: 1px;
  text-align: center;
}

#welcome-section a{
  color: #ff6c72;
  cursor: pointer;
  opacity: 0.7;
}

#welcome-section .cb-validation{
  width: 25px;
  height: 25px;
  background-image: url("../../assets/combined-shape-copy.svg");
  display: inline-block;
  vertical-align: top;
  padding-right: 35px;
  background-repeat: no-repeat;
}

#welcome-section label{
  width: 40%;
  text-align: left;
  font-weight: 300;
  font-size: 18px;
}
</style>