<template>
<div id="get-orders-section">
      <div class="container">
          <div class="row">
            <div class="col-md-12">
                <p>Amadeus returns an array of tokens, combined in pairs. Then the dApp choose which tokens to trade using end point <b>GET orders</b>.</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToChooseOrdersPage()">GET ORDERS
                <img src="../../assets/arrow-right.svg"/>
                </a>
            </div>
        </div>
      </div>
</div>
</template>


<script>
import { mapMutations } from 'vuex'

export default {
  name: 'get-orders',
  methods: {
    ...mapMutations({
      addCodeLine: 'addCodeLine',
      updatePageId: 'changePage'
    }),
    goToChooseOrdersPage () {
      this.updatePageId(3)
    }
  },
  mounted () {
    this.addCodeLine('teste teste')
  }
}
</script>

<style scoped>
#get-orders-section .container {
    padding-top: 130px;
}

#get-orders-section .container p{
    font-size: 22px;
    color: #ffffff;
    font-weight: 300;
}

#get-orders-section .container p b{
    font-weight: 400;
}
</style>