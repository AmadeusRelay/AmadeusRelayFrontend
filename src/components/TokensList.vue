<template>
  <div class="form-group">
    <select v-model="token" :disabled="!tokenAIsSelected" class="form-control">
      <option value="">{{ emptyOption }}</option>
      <option v-for="(coin, index) in tokenList" :value="coin">{{ coin }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { OrderService } from '../api'
import { Getter } from 'vuex-class'

@Component
export default class TokensList extends Vue {
  tokenList: string[] = []
  emptyOption: string = ''

  @Getter getStrategyId

  mounted () {
    if (this.tokenAIsSelected) {
      this.getTokenPairs('')
    }
    this.fillEmptyOption()
  }

  fillEmptyOption () {
    if(this.getStrategyId() == 1) {
      this.emptyOption = "All tokens";
    }
    else {
      this.emptyOption = "Select token";
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

<style scoped>

select.form-control{
  border-radius: 0px;
  cursor: pointer;
}

</style>