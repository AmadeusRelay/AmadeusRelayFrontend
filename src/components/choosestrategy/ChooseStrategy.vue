<template>
<div id="choose-strategy-section">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <p>We have implemented two different strategies, Reserve Manager and Quote Provider.
See below their characteristics and choose one to proceed.</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-2"></div>
            <div class="col-md-8 btn-next-step" @click="goToTokenPairsPageReserveManager()">
                <div class="btn-text">RESERVE MANAGER
                    <p>Amadeus provides large signed orders with short expiration times. You should call fillOrder filling your address as taker address to complete the order</p>
                </div>
                <div class="btn-img">
                    <img src="../../assets/arrow-right.svg"/>
                </div>
            </div>
        </div>
        <br/>
        <div class="row">
            <div class="col-md-2"></div>
            <div class="col-md-8 btn-next-step" @click="goToTokenPairsPageQuoteProvider()">
                <div class="btn-text">QUOTE PROVIDER
                    <p>Amadeus provides intents to trade and specifies the fee value. You must sign the order and post it to the relayer, who calls fillOrder to complete it</p>
                </div>
                <div class="btn-img">
                    <img src="../../assets/arrow-right.svg"/>
                </div>
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

@Component
export default class ChooseStrategy extends Vue {
  @Mutation changePage
  @Mutation chooseStrategy

  goToTokenPairsPageReserveManager () {
    this.chooseStrategy(1);
    this.changePage(2);
  }

  goToTokenPairsPageQuoteProvider () {
    this.chooseStrategy(2);
    this.changePage(2);
  }
}
</script>

<style scoped>
#choose-strategy-section .container {
    padding-top: 80px;
    padding-right: 160px;
    text-align: center;
    color: white;
}

#choose-strategy-section .container p{
    font-size: 22px;
    color: #ffffff;
    font-weight: 300;
    text-align: center;
}

#choose-strategy-section .container p b{
    font-weight: 400;
}

#choose-strategy-section .line{
  margin-top: 60px;
  margin-bottom: 25px;
  border: solid 1px #a09fac;
  background-color: #a09fac;
  height: 1px;
  text-align: center;
}

#choose-strategy-section .foot-text a{
  color: #ff6c72;
  cursor: pointer;
  opacity: 0.7;
  word-break: keep-all;
  white-space: pre;
}

#choose-strategy-section p.foot-text{
  font-size: 16px;
  word-wrap: none;
  word-break: keep-all;
}

#choose-strategy-section div.btn-next-step{
    text-align: left;
    font-size: 20px;
    color: #ff6c72;
    font-weight: 500;
    cursor: pointer;
    display: table;
    background-color: rgba(119, 117, 144, 0.5);
    padding: 15px;
}

#choose-strategy-section div.btn-next-step .btn-text{
    display: table-cell;
    width: 80%;
}

#choose-strategy-section div.btn-next-step .btn-text p{
    margin-bottom: 0px;
}

#choose-strategy-section div.btn-next-step .btn-img{
    display: table-cell;
    width: 5%;
    vertical-align: middle;
}

#choose-strategy-section div.btn-next-step .btn-img img{
    float: right;
}

#choose-strategy-section div.btn-next-step p{
    text-align: left;
    font-size: 17px;
}
</style>