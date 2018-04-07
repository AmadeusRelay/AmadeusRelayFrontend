<template>
    <div id="main-section" ref="mainsection">
      <div class="container-fluid" ref="container" v-bind:class="{'full-container': pageId <= 1, 'half-container': pageId > 1}">
        <div v-if="pageId > 1" class="nav-container">
          <span v-for="n in [2, 3, 4, 5, 6]" :key="n" class="nav-state" v-bind:class="{'active': pageId && pageId == n}"></span>
        </div>
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-4">
              <img id="logo" src="./assets/logo_amadeus.png">
            </div>
            <div v-if="pageId > 1" class="col-lg-8 col-md-8">
              <div class="col-lg-3 col-md-5 pull-right">
                <button class="js-add btn btn-block uppercase" type="button" @click="goToWelcomePage()">Restart</button> 
              </div>
            </div>
          </div>
        </div>
        <loading v-if="loading"></loading>
        <welcome v-if="pageId == 0"></welcome>
        <choose-strategy v-if="pageId == 1"></choose-strategy>
        <token-pairs v-if="pageId == 2"></token-pairs>
        <get-orders v-if="pageId == 3 && strategyId == 1"></get-orders>
        <post-fee v-if="pageId == 3 && strategyId == 2"></post-fee>
        <choose-order v-if="pageId == 4 && strategyId == 1"></choose-order>
        <sign-order v-if="pageId == 4 && strategyId == 2"></sign-order>
        <fill-order v-if="pageId == 5 && strategyId == 1"></fill-order>
        <post-order v-if="pageId == 5 && strategyId == 2"></post-order>
        <order-confirmation v-if="pageId == 6"></order-confirmation>
        <order-error v-if="pageId == 7"></order-error>
      </div>
      <div class="code-container" v-if="pageId > 1">
        <codemirror v-if="pageId > 1" ref="myCm" v-model="code"></codemirror>
      </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Welcome from './components/welcome/Welcome.vue'
import TokenPairs from './components/tokenpairs/TokenPairs.vue'
import GetOrders from './components/getorders/GetOrders.vue'
import ChooseOrder from './components/chooseorder/ChooseOrder.vue'
import FillOrder from './components/fillorder/FillOrder.vue'
import OrderConfirmation from './components/confirmation/OrderConfirmation.vue'
import OrderError from './components/error/OrderError.vue'
import Loading from './components/shared/Loading.vue'
import ChooseStrategy from './components/choosestrategy/ChooseStrategy.vue'
import PostFee from './components/postfee/PostFee.vue'
import SignOrder from './components/signorder/SignOrder.vue'
import PostOrder from './components/postorder/PostOrder.vue'

export default {
  components: {
    Welcome,
    TokenPairs,
    GetOrders,
    ChooseOrder,
    FillOrder,
    OrderConfirmation,
    OrderError,
    Loading,
    ChooseStrategy,
    PostFee,
    SignOrder,
    PostOrder
  },
  computed: mapState({
    pageId: state => state.pageId,
    strategyId: state => state.strategyId,
    code: state => state.code,
    loading: state => state.loading
  }),
  methods: {
    ...mapMutations({
      updatePageId: 'changePage',
      cleanCodeContainer: 'cleanCodeLine'
    }),
    goToWelcomePage () {
      this.cleanCodeContainer()
      this.updatePageId(0)
    }
  },
  watch: {
    code () {
      var height = this.$refs.container.clientHeight;
      this.$refs.myCm.codemirror.setSize('auto', height)
    }
  }
}
</script>

<style scoped>
@import '../node_modules/lato-font/css/lato-font.css';

#main-section{
  max-height: 400px;
}
#main-section .container-fluid {
    padding-top: 45px;
}

#main-section .full-container {
    width: 100%;
    padding-left: 160px;
    min-height: 100vh;
    height: auto;
    background-image: linear-gradient(to bottom, #433c7f, #2f295f);
    background-size: cover;
}

#main-section .half-container {
    width: 75%;
    padding-left: 160px;
    float: left;
    min-height: 100vh;
    height: 100%;
    background-image: linear-gradient(to bottom, #433c7f, #2f295f);
    background-size: cover;
}

#main-section .code-container {
    width: 25%;
    background-color: #26204a;
    box-shadow: inset 2px 1px 10px 0 rgba(35, 31, 32, 0.4);
    min-height: 100vh;
    height: 100%;
    float: right;
}

#main-section .nav-container {
    display: block;
    position: absolute;
    padding-top: 200px;
}

#main-section .nav-container .nav-state{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #a09fac;
    display: block;
    margin-bottom: 22px;
    margin-left: -50px;
}

#main-section .nav-container .nav-state.active{
    width: 20px;
    height: 20px;
    background-color: #ff6c72;
    margin-left: -55px;
}

#main-section pre{
    padding-top: 10px;
}

#main-section code{
    line-height: 22px;
    color: white;
    width: 100%;
    display: block;
}

#main-section code span{
    padding-left: 20px;
    color: #a09fac;
}

#logo {
  width: 250px;
}

button.btn{
  border-radius: 4px;
  color: white;
  border: solid 1px #76729f;
  background-color: transparent;
  height: 46px;
  text-transform: uppercase;
}

.vue-codemirror {
  height: inherit;
}

@media (max-width: 992px){
  #main-section .container-fluid {
    padding-top: 30px;
  }

  #main-section .full-container {
    padding-left: 140px;
  }

  #main-section .half-container {
      padding-left: 140px;
  }
}
</style>