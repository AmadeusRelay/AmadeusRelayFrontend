<template>
  <div class="form-group">
    <select v-model="token" :disabled="!tokenAIsSelected" class="form-control">
      <option value="">All tokens</option>
      <option v-for="(coin, index) in tokenList" :value="coin">{{ coin }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { OrderService } from '../api'

@Component
export default class TokensList extends Vue {
  tokenList: string[] = []

  mounted () {
    if (this.tokenAIsSelected) {
      this.getTokenPairs('')
    }
  }

  getTokenPairs (tokenSelected : string) {
    var orderService : OrderService = new OrderService()
    orderService.getTokenPairs(tokenSelected).then(this.onSuccessfullyGetTokenPairs)
  }

  onSuccessfullyGetTokenPairs (response: any) {
    this.tokenList = response
  }

  @Prop()
  token: string
  @Prop()
  tokenAIsSelected : boolean

  @Watch('token')
  onPropertyChanged (value: string, oldValue: string) {
    this.$emit('update:token', value)
  }
}
</script>