<template>
  <div id="loading-section">
    <div class="container">
        <div class='row'>
            <div class='col-md-12 spin-container'>
                <circle-spin :size='size' :background='backgroundColor' :color='color' :stroke='stroke'></circle-spin>
            </div>
        </div>
        <div class='row'>
            <div class='col-md-12'>
                <p>Your transaction is being processed...</p>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Circle2 } from 'vue-loading-spinner'

@Component({
  components: { 'circle-spin': Circle2 }
})

export default class Loading extends Vue {
  size: string = '80px'
  backgroundColor: string = '#433c7f'
  color: string = '#ff6c72'
  stroke: string = '9px'
}
</script>

<style scoped>
#loading-section .container {
    padding-top: 160px;
}

#loading-section .spin-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#loading-section p {
    font-size: 18px;
    color: #ffffff;
    font-weight: 300;
    text-align: center;
    margin-top: 20px;
}
</style>