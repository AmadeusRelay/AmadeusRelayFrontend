<template>
<div id="order-confirmation-section">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <p>And that’s it! Amadeus will take care of trading your tokens using the 0x Protocol.
                    You can check your wallet balance at Metamask to see your transaction.</p>
            </div>
        </div>
        <br />
        <div class="row">
            <div class="col-md-1">
            </div>
            <div class="col-md-11">
                <div class="row">
                    <div class="col-md-1">
                    </div>
                    <div class="col-md-2">
                        <img src="../../assets/fill-1.svg"/>
                    </div>
                    <div class="col-md-1">
                        <div class="row">
                            <img class="arrow-right" src="../../assets/arrow-right.svg"/>
                        </div>
                        <div class="row">
                            <img class="arrow-left" src="../../assets/arrow-right.svg"/>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <img src="../../assets/logo.svg"/>
                    </div>
                    <div class="col-md-1">
                        <div class="row">
                            <img class="arrow-right" src="../../assets/arrow-right.svg"/>
                        </div>
                        <div class="row">
                            <img class="arrow-left" src="../../assets/arrow-right.svg"/>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <img src="../../assets/page-1.svg"/>
                    </div>
                </div>
            </div>
        </div>
        <br />
        <br />
        <div class="row">
            <div class="col-md-1"></div>
            <div class="col-md-11">
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-3">
                        <button class="js-add btn btn-block btn-documentation" type="button" @click="goToDocumentation()">DOCUMENTATION</button>
                    </div>
                    <div class="col-md-3">
                        <button class="js-add btn btn-block btn-start-demo" type="button" @click="goToWelcomePage()">RETRY DEMO</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'order-confirmation',
  methods: {
    ...mapMutations({
      addCodeLine: 'addCodeLine',
      updatePageId: 'changePage',
      cleanCodeContainer: 'cleanCodeLine'
    }),
    goToWelcomePage () {
      this.cleanCodeContainer()
      this.updatePageId(0)
    },
    goToDocumentation () {
      window.open('https://amadeusrelay.github.io/AmadeusRelayFrontend/')
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
#order-confirmation-section .container {
    padding-top: 110px;
}

#order-confirmation-section .container p{
    font-size: 22px;
    color: #ffffff;
    font-weight: 300;
}

#order-confirmation-section .arrow-right {
  margin-top: 15px;
  width: 23px;
  height: 18px;
  object-fit: contain;
}

#order-confirmation-section .arrow-left {
  margin-top: 10px;
  width: 23px;
  height: 18px;
  object-fit: contain;
  transform: rotate(180deg);
}
</style>