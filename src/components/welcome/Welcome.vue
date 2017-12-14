<template>
<div id="welcome-section">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h2>Welcome to our demo!</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
          <p class="subtitle">In this demo we will walk you through how our API works and how you can integrate it with your dApp. In order to properly use all its funcionalities, you need to:</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <label>
            <span class="cb-validation" v-bind:class="{'active' : metamaskInstalled}"></span> Have Metamask installed in your browser
          </label>
        </div>
        <div class="col-md-12">
        <label>
          <span class="cb-validation" v-bind:class="{'active' : metamaskLogin}"></span> Login into your Metamask account
        </label>
        </div>
        <div class="col-md-12">
          <label>
            <span class="cb-validation" v-bind:class="{'active' : metamaskNetwork}"></span> Connect Metamast to Kovan test network
          </label>
        </div>       
      </div>
      <br/><br/>
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-3">
          <button class="js-add btn btn-block btn-documentation" type="button" @click="goToDocumentation()">DOCUMENTATION</button>
        </div>
        <div class="col-md-3">
          <button class="js-add btn btn-block btn-start-demo" type="button" @click="goToTokenPairsPage()" :disabled="!metamaskInstalled || !metamaskLogin || !metamaskNetwork">LET'S GO!</button>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4">
          <div class="line"></div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
          <p class="foot-text">If you don’t have any money in your wallet, you can get some using a Kovan faucet: 
            <a href="https://github.com/kovan-testnet/faucet">https://github.com/kovan-testnet/faucet</a></p>
        </div>
      </div>
    </div>
</div> 
</template>

<script>
import { mapMutations } from 'vuex'
import { OrderService } from '../../api'

export default {
  name: 'welcome',
  data: function () {
    return {
      metamaskInstalled: false,
      metamaskLogin: false,
      metamaskNetwork: false
    }
  },
  methods: {
    ...mapMutations({
      updatePageId: 'changePage'
    }),
    goToTokenPairsPage () {
      this.updatePageId(1)
    },
    goToDocumentation () {
      window.open('https://amadeusrelay.github.io/AmadeusRelayFrontend/')
    },
    checkMetamaskIntalled: function () {
      setInterval(function () {
        var orderService = new OrderService()
        this.metamaskInstalled = orderService.checkMetamaskInstalled()
        this.metamaskLogin = orderService.checkMetamaskLoggedIn()
        this.metamaskNetwork = orderService.checkMetamaskNetwork()
      }.bind(this),
      200)
    }
  },
  mounted () {
    this.checkMetamaskIntalled()
  }
}
</script>

<style scoped>
#welcome-section .container {
    padding-top: 50px;
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

#welcome-section .line{
  margin-top: 60px;
  margin-bottom: 25px;
  border: solid 1px #a09fac;
  background-color: #a09fac;
  height: 1px;
  text-align: center;
}

#welcome-section a{
  color: #ff6c72;
  cursor: pointer;
  opacity: 0.7;
  word-break: keep-all;
  white-space: pre;
}

#welcome-section .cb-validation{
  width: 25px;
  height: 25px;
  background-image: url("../../assets/oval-5-copy-2.svg");
  display: inline-block;
  vertical-align: top;
  padding-right: 35px;
  background-repeat: no-repeat;
  background-size: 24px;
}

#welcome-section .cb-validation.active{
  background-image: url("../../assets/combined-shape-copy.svg");
}

#welcome-section label{
  width: 40%;
  text-align: left;
  font-weight: 300;
  font-size: 18px;
  padding-top: 15px;
}

#welcome-section .foot-text{
  font-size: 16px;
  word-wrap: none;
  word-break: keep-all;
}
</style>