<template>
<div id="post-order-section">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <p>In order to be able to fill your choosen order, you need to:</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToFinalPage()">POST ORDER
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
export default class PostOrder extends Vue {
  @Mutation changePage

  goToFinalPage () {
    this.changePage(6);
  }
}
</script>