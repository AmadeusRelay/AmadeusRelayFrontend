<template>
<div id="fill-order-section">
      <div class="container">
          <div class="row">
            <div class="col-md-12">
                <a class="btn-next-step" @click="goToFinalPage()">FILL ORDER
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
  name: 'fill-order',
  methods: {
    ...mapMutations({
      addCodeLine: 'addCodeLine',
      updatePageId: 'changePage'
    }),
    goToFinalPage () {
      this.updatePageId(5)
    }
  },
  mounted () {
    this.addCodeLine('teste teste')
  }
}
</script>