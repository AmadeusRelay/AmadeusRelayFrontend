<template>
<div id="get-orders-section">
      <div class="container">
          <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToFillOrderPage()">CHOOSE ORDER
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
    goToFillOrderPage () {
      this.updatePageId(4)
    }
  },
  mounted () {
    this.addCodeLine('teste teste')
  }
}