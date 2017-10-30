<template>
    <div id="main-section">
      <div class="row" id="logo">
        <img src="http://amadeusrelay.org/img/logo_nome_transparente.png">
      </div>
      <br><br><br>
      <p class="text-center">Choose tokens to trade:</p>
      <div class="row">
        <div class="col-md-2"/>
        <div class="col-md-4">
          <token-list :token='token1' @update:token='val => token1 = val'/> 
        </div>
        <div class="col-md-4">
          <token-list :token='token2' @update:token='val => token2 = val'/>
        </div> 
        <div class="col-md-2">
          <button @click="getOrders" class="js-add btn btn-primary btn-block" 
              type="button">Get Orders!</button> 
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TokenList from './components/TokensList.vue'

@Component({
  name: 'App',
  components: {
    'token-list': TokenList
  }
})

export default class App extends Vue {
  token1: string
  token2: string
  mounted () {
    this.token1 = ''
    this.token2 = ''
  }
  getOrders () {
    alert(`Token1: ${this.token1} | Token2: ${this.token2}`)
  }
}
</script>

<style scoped>
#main-section{
  color: #FFFFFF;
  text-align: center;
  background-position: 50% 50%;
  background-size: cover;
  max-height: 626px;
  overflow: hidden;
}

#logo {
  text-align: center;
  color: #2c3e50;
  display: block;
  margin-top: 60px;
  margin-left: auto;
  margin-right: auto;
}
</style>