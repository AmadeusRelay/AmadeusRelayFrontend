<template>
 <button class="js-add btn btn-block uppercase" type="button" @click="goToTokenPairsPage()">Let's Go</button> 
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'welcome',
  methods: {
    ...mapMutations({
      updatePageId: 'changePage'
    }),
    goToTokenPairsPage () {
      this.updatePageId(1)
    }
  }
}
</script>