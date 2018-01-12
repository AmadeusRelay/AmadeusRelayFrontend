<template>
    <div id="main-section" ref="mainsection">
      <div class="container-fluid" v-bind:class="{'full-container': pageId == 0, 'half-container': pageId != 0}">
        <div v-if="pageId != 0" class="nav-container">
          <span v-for="n in 5" class="nav-state" v-bind:class="{'active': pageId && pageId == n}"></span>
        </div>
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-4">
              <img id="logo" src="http://amadeusrelay.org/img/logo_nome_transparente.png">
            </div>
            <div v-if="pageId != 0" class="col-md-8">
              <div class="col-md-3 pull-right">
                <button class="js-add btn btn-block uppercase" type="button" @click="goToWelcomePage()">Restart</button> 
              </div>
            </div>
          </div>
        </div>
        <loading v-if="loading"></loading>
        <welcome v-if="pageId == 0"></welcome>
        <token-pairs v-if="pageId == 1"></token-pairs>
        <get-orders v-if="pageId == 2"></get-orders>
        <choose-order v-if="pageId == 3"></choose-order>
        <fill-order v-if="pageId == 4"></fill-order>
        <order-confirmation v-if="pageId == 5"></order-confirmation>
        <order-error v-if="pageId == 6"></order-error>
      </div>
      <codemirror v-if="pageId != 0" ref="myCm" v-model="code"></codemirror>
    </div>
</template>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-108007037-3"></script>
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

export default {
  components: {
    Welcome,
    TokenPairs,
    GetOrders,
    ChooseOrder,
    FillOrder,
    OrderConfirmation,
    OrderError,
    Loading
  },
  computed: mapState({
    pageId: state => state.pageId,
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
    },
    gtag () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(arguments);
    }
  },
  mounted: function () {
    this.gtag('js', new Date());

    this.gtag('config', 'UA-108007037-3');
  },
  watch: {
    code () {
      this.$refs.myCm.codemirror.setSize('auto', '100%')
    }
  }
}
</script>

<style scoped>
@import '../node_modules/lato-font/css/lato-font.css';

#main-section{
  background-image: linear-gradient(to bottom, #433c7f, #2f295f);
  background-size: cover;
  height: 100vh;
  overflow: hidden;
}

#main-section .container-fluid {
    padding-top: 45px;
}

#main-section .full-container {
    width: 100%;
    padding-left: 160px;
}

#main-section .half-container {
    width: 75%;
    padding-left: 160px;
    float: left;
}

#main-section .code-container {
    width: 25%;
    background-color: #26204a;
    box-shadow: inset 2px 1px 10px 0 rgba(35, 31, 32, 0.4);
    height: 100vh;
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
</style>