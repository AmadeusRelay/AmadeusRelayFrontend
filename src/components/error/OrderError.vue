<template>
<div id="order-error-section">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <p>We are sorry but your operation could not be completed because the following error has occurred:</p>
            </div>
        </div>
        <br />
        <div class="row center">
            <div class="col-md-1"></div>
            <div class="col-md-11">
                <div class="row">
                    <div class="col-lg-1 col-md-0"></div>
                    <div class="col-lg-8 col-md-10">
                        <div class="row error">
                            <div class="col-md-1">
                                    <img src="../../assets/error.svg">
                            </div>
                            <div class="col-md-11">
                                {{errorMessage}}<br>
                                {{errorDetails}}
                            </div>        
                        </div>         
                    </div>        
                </div>         
            </div>           
        </div>
        <br />
        <br />
        <div class="row">
            <div class="col-lg-1 col-md-0"></div>
            <div class="col-lg-11 col-md-12">
                <div class="row">
                    <div class="col-lg-2 col-md-1"></div>
                    <div class="col-lg-3 col-md-4">
                        <button class="js-add btn btn-block btn-documentation" type="button" @click="goToDocumentation()">DOCUMENTATION</button>
                    </div>
                    <div class="col-lg-3 col-md-4">
                        <button class="js-add btn btn-block btn-start-demo" type="button" @click="goToWelcomePage()">RETRY DEMO</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'

@Component
export default class OrderError extends Vue {
  @Mutation changePage
  @Mutation cleanCodeLine
  @Getter getErrorMessage

  errorMessage: string = '';
  errorDetails: string = '';

  mounted () {
    this.errorMessage = this.getErrorMessage;
    this.setErrorDetails();
  }

  setErrorDetails () {
    if (this.errorMessage === 'ORDER_FILL_EXPIRED') {
      this.errorDetails = "The order created by Amadeus Relay expired because the expiration time is short in our strategy. Don't worry, get orders again and interact with them more quickly.";
    } else if (this.errorMessage === 'INSUFFICIENT_TAKER_ALLOWANCE') {
      this.errorDetails = "You haven't allowed 0x to interact with your funds or allowed a lower quantity than you want to exchange.";
    } else if (this.errorMessage === 'INSUFFICIENT_TAKER_BALANCE') {
      this.errorDetails = "Your wallet does not have the tokens' quantity that you want to trade.";
    }
  }

  goToWelcomePage () {
    this.cleanCodeLine()
    this.changePage(0)
  }

  goToDocumentation () {
    window.open('https://amadeusrelay.github.io/AmadeusRelayFrontend/')
  }
}
</script>

<style scoped>
#order-error-section .container {
    padding-top: 110px;
}

#order-error-section .container p{
    font-size: 22px;
    color: #ffffff;
    font-weight: 300;
}

#order-error-section .error{
  width: 100%;
  min-height: 115px;
  border-radius: 3px;
  background-color: rgba(119, 117, 144, 0.3);
  color: white;
  font-family: Lato;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.56;
  letter-spacing: normal;
  text-align: left;
  padding: 20px;
}

@media (max-width: 992px){
  #order-error-section .container p{
    font-size: 20px;
  }
}
</style>