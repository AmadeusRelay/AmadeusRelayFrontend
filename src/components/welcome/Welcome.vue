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
          <p class="subtitle">In this demo we will walk you through how our API works and how you can integrate it with your dApp. In order to properly use all its functionalities, you need to:</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <label>
            <span class="cb-validation" v-bind:class="{'active' : metamaskInstalled || toshiInstalled, 'inactive' : !metamaskInstalled && !toshiInstalled}"></span> Have {{!metamaskInstalled && !toshiInstalled ? 'Metamask or Toshi' : (metamaskInstalled ? 'Metamask' : 'Toshi')}}  installed in your browser
          </label>
        </div>
        <div class="col-md-12">
        <label>
          <span class="cb-validation" v-bind:class="{'active' : web3Login, 'inactive' : !web3Login}"></span> Login to your {{!metamaskInstalled && !toshiInstalled ? 'Metamask or Toshi' : (metamaskInstalled ? 'Metamask' : 'Toshi')}} account
        </label>
        </div>
        <div class="col-md-12">
          <label>
            <span class="cb-validation" v-bind:class="{'active' : web3Network, 'inactive' : !web3Network}"></span> Connect {{!metamaskInstalled && !toshiInstalled ? 'Metamask or Toshi' : (metamaskInstalled ? 'Metamask' : 'Toshi')}} to {{networkName}} test network
          </label>
        </div>       
      </div>
      <br/><br/>
      <div class="row">
        <div class="col-lg-3 col-md-2"></div>
        <div class="col-lg-3 col-md-4 col-sm-5">
          <button class="js-add btn btn-block btn-documentation" type="button" @click="goToDocumentation()">DOCUMENTATION</button>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-5">
          <button class="js-add btn btn-block btn-start-demo" type="button" @click="goToChooseStrategyPage()" :disabled="(!metamaskInstalled && !toshiInstalled) || !web3Login || !web3Network">LET'S GO!</button>
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
            <a target="_blank" href="https://github.com/kovan-testnet/faucet">https://github.com/kovan-testnet/faucet</a></p>
        </div>
      </div>
    </div>
</div> 
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import { Web3Service } from '../../api'
const config = require('../../../config')

@Component
export default class Welcome extends Vue {
  metamaskInstalled: boolean = false
  toshiInstalled: boolean = false
  web3Login: boolean = false
  web3Network: boolean = false
  networkName = 'Kovan';

  @Mutation changePage

  goToChooseStrategyPage () {
    this.changePage(1)
  }

  goToDocumentation () {
    window.open('https://amadeusrelay.github.io/AmadeusRelayFrontend/');
  }

  checkMetamaskIntalled () {
    setInterval(function () {
      var web3Service = new Web3Service()
      this.metamaskInstalled = web3Service.checkMetamaskInstalled()
      this.toshiInstalled = web3Service.checkToshiInstalled()
      this.web3Login = web3Service.checkLoggedIn()
      this.web3Network = web3Service.checkNetwork()
    }.bind(this),
    200);
  }

  mounted () {
    this.checkMetamaskIntalled();
    if (config.network.networkId === 1) {
      this.networkName = 'Mainnet';
    } else if (config.network.networkId === 42) {
      this.networkName = 'Kovan';
    }
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

#welcome-section .cb-validation.inactive{
  background-image: url("../../assets/error-x.svg");
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

@media (max-width: 992px){
  #welcome-section label{
    width: 70%;
    font-size: 17px;
  }

  #welcome-section .container {
    padding-top: 40px;
  }

  #welcome-section p.subtitle {
    font-size: 17px;
  }

  #welcome-section .foot-text{
    font-size: 15px;
  }

  #welcome-section .line{
    margin-top: 40px;
  }
}
</style>