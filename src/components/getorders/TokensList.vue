<template>
  <div class="form-group">
    <select v-model="tokenSelected" :disabled="!takerTokenIsSelected" class="form-control">
      <option value="">All tokens</option>
      <option v-for="(coin, index) in tokenList" :value="coin" :key="coin">{{ coin }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

@Component
export default class TokensList extends Vue {
  tokenList: string[] = []
  tokenSelected = ''

  @Getter getTokenPairs

  mounted () {
    if (this.takerTokenIsSelected) {
      this.refreshToken('')
    }
    this.tokenSelected = this.token;
  }

  refreshToken (takerTokenSelected) {
    var tokens = this.getTokenPairs
    if (takerTokenSelected) {
      this.tokenList = tokens.filter(a => a.tokenASymbol === takerTokenSelected).map(i => i.tokenBSymbol)
    } else {
      this.tokenList = tokens.map(i => i.tokenASymbol).filter((item, pos, arr) => arr.indexOf(item) === pos)
    }
  }

  @Prop()
  token: string
  @Prop()
  takerTokenIsSelected : boolean

  @Watch('tokenSelected')
  onPropertyChanged (value: string, oldValue: string) {
    this.$emit('updateToken', value)
  }
}
</script>

<style scoped>

select.form-control {
  cursor: pointer;
  border-radius: 3px;
  background-color: rgba(119, 117, 144, 0.5);
  color: #ffffff;
  border: none;
  height: 52px !important;
}

</style>