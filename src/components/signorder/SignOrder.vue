<template>
<div id="sign-order-section">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <p>Our API returns the fee recipient address and the fee value. First the DApp needs to sign the order and then use end point <b>POST order.</b></p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToPostOrderPage()">SIGN ORDER
                    <img src="../../assets/arrow-right.svg"/>
                </a>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

@Component
export default class SignOrder extends Vue {
  @Mutation changePage

  goToPostOrderPage () {
    this.changePage(5);
  }
}
</script>