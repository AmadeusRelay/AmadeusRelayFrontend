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
        <welcome v-if="pageId == 0"></welcome>
        <token-pairs v-if="pageId == 1"></token-pairs>
      </div>
        <div v-if="pageId != 0" class="code-container">
          <pre>
            <code v-for="(line, index) in codeLines"><span>{{index}}     {{line}}</span></code>
          </pre>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Welcome from './components/welcome/Welcome.vue'
import TokenPairs from './components/tokenpairs/TokenPairs.vue'

export default {
  components: {
    Welcome,
    TokenPairs
  },
  computed: mapState({
    pageId: state => state.pageId,
    codeLines: state => state.codeLines
  }),
  methods: {
    ...mapMutations({
      updatePageId: 'changePage',
      inicializeCodeLines: 'inicializeCodeLines'
    }),
    setCodeLineNumber () {
      var lineHeight = 22
      var codeLineNumber = Math.round((this.$refs.mainsection.clientHeight - 30) / lineHeight)
      this.inicializeCodeLines(codeLineNumber)
    },
    goToWelcomePage () {
      this.updatePageId(0)
    }
  },
  mounted () {
    this.setCodeLineNumber()
  }
}
</script>

<style scoped>
@import '../node_modules/lato-font/css/lato-font.css';

#main-section{
  background-image: linear-gradient(to bottom, #433c7f, #2f295f);
  background-size: cover;
  overflow: hidden;
  height: 100vh;
}

#main-section .container-fluid {
    padding-top: 75px;
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
</style>