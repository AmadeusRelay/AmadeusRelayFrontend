<template>
  <div class="form-group">
    <select v-model="token" class="form-control">
      <option value=""></option>
      <option v-for="(coin, index) in tokenList" :value="coin">{{ coin }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class TokensList extends Vue {
  tokenList: string[] = ['ZRX', 'ETH', 'AAA']

  @Prop()
  token: string

  @Watch('token')
  onPropertyChanged (value: string, oldValue: string) {
    this.$emit('update:token', value)
  }
}
</script>