<template>
<div id="post-fee-section">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <p>The DApps needs to choose the token and the amount it wants to sell as well as the token to buy. We will return the maximum amount we are willing to sell.</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToSignOrderPage()">POST FEE
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
export default class PostFee extends Vue {
  @Mutation changePage

  goToSignOrderPage () {
    this.changePage(4);
  }
}
</script>