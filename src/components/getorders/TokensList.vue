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
import { Getter } from 'vuex-class'

@Component
export default class TokensList extends Vue {
  tokenList: string[] = []

  @Getter getTokenPairs

  mounted () {
    if (this.tokenAIsSelected) {
      this.refreshToken('')
    }
  }

  refreshToken (tokenASelected) {
    debugger
    var tokens = this.getTokenPairs
    if (tokenASelected) {
      this.tokenList = tokens.filter(a => a.tokenASymbol === tokenASelected).map(i => i.tokenBSymbol)
    } else {
      this.tokenList = tokens.map(i => i.tokenASymbol)
    }
  }

  @Prop()
  token: string
  @Prop()
  tokenAIsSelected : boolean

  @Watch('token')
  onPropertyChanged (value: string, oldValue: string) {
    debugger
    this.$emit('update:token', value)
  }
}
</script>

<style scoped>

select.form-control{
  border-radius: 0px;
  cursor: pointer;
}

</style>