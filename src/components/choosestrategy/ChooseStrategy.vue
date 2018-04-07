<template>
<div id="choose-strategy-section">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <p>We have implemented two different strategies, Reservae Manager and Quote Provider.</p>
                <p>See below their characteristics and choose one to proceed.</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToTokenPairsPageReserveManager()">Reserve Manager
                    <img src="../../assets/arrow-right.svg"/>
                </a>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToTokenPairsPageQuoteProvider()">Quote Provider
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
export default class ChooseStrategy extends Vue {
  @Mutation changePage
  @Mutation chooseStrategy

  goToTokenPairsPageReserveManager () {
    this.chooseStrategy(1);
    this.changePage(2);
  }

  goToTokenPairsPageQuoteProvider () {
    this.chooseStrategy(2);
    this.changePage(2);
  }
}
</script>