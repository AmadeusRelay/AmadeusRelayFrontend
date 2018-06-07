<template>
  <div id="popup-error-section">
    <div class="container">
        <div class="row">
            <div class="col-md-2">
            </div>
            <div class="popup col-md-8">
                    <div class="row">
                        <div class="col-md-12">
                            <p>We are sorry but your operation could not be completed because the following error has occurred:</p>
                        </div>
                    </div>
                    <div class="row center">
                        <div class="col-md-1"></div>
                        <div class="col-md-11">
                                <div class="row error">
                                    <div class="col-md-1">
                                            <img src="../../assets/error.svg">
                                    </div>
                                    <div class="col-md-11" v-if="errorModel">
                                        <div class="title">{{errorModel.reason}}</div>
                                        <div class="reason">{{errorModel.title}}</div>
                                        <div v-if="errorModel.validationErrors" class="validation col-md-11">
                                            <li v-for="(item, index) in errorModel.validationErrors" :key="index">
                                                <span class="title">{{item.reason}}</span><br/>
                                                <span class="reason">{{item.title}}</span>
                                            </li>
                                        </div>
                                    </div>        
                                </div>         
                        </div>           
                    </div>
                    <br />
                    <br />
                    <div class="row">
                        <div class="col-lg-12 col-md-12">
                            <div class="row">
                                <div class="col-lg-3 col-md-1"></div>
                                <div class="col-lg-3 col-md-4">
                                    <button class="js-add btn btn-block btn-documentation" type="button" @click="close()">CONTINUE</button>
                                </div>
                                <div class="col-lg-3 col-md-4">
                                    <button class="js-add btn btn-block btn-start-demo" type="button" @click="goToWelcomePage()">RETRY DEMO</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>>
            <div class="col-md-2">
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { ErrorModel } from '../../model/errorModel';

@Component
export default class PopupError extends Vue {
  @Mutation changePage
  @Mutation cleanCodeLine
  @Mutation updateErrorModel
  @Getter getPopupErrorModel

  errorModel: ErrorModel = null;

  mounted () {
    this.errorModel = this.getPopupErrorModel;
  }

  goToWelcomePage () {
    this.cleanCodeLine()
    this.updateErrorModel(null);
    this.changePage(0)
  }

  close () {
    this.updateErrorModel(null);
  }
}
</script>

<style scoped>
#popup-error-section .container {
    padding-top: 10%;
    padding-right: 0px;
    background-color: rgba(66 , 59, 125, 0.8);
    position: absolute;
    z-index: 100;
    height: -moz-calc(100vh - 400px);
    height: -webkit-calc(100vh - 400px);
    height: calc(100vh - 100px);
    width: 75%;
    max-width: 75%;
    left: 0px;
}

#popup-error-section .popup {
    background-color: rgba(99 , 59, 125, 1);
    padding-bottom: 30px;
}

#popup-error-section .error .title{
    font-size: 18px;
    font-weight: 300;
}

#popup-error-section .error .reason{
    font-size: 18px;
    font-weight: 200;
    padding-bottom: 5px;
}

#popup-error-section div .error .validation{
    background-color: rgba(89 , 59, 125, 1);
    max-height: 200px;
    overflow: auto;
    width: 100%;
}

#popup-error-section .error .validation .title{
    font-size: 16px;
    font-weight: 300;
}

#popup-error-section .error .validation .reason{
    font-size: 16px;
    padding-left: 20px;
}

#popup-error-section .error {
    font-size: 16px;
    color: #ffffff;
    font-weight: 200;
}

#popup-error-section p {
    font-size: 18px;
    color: #ffffff;
    font-weight: 300;
    text-align: center;
    margin-top: 20px;

}
</style>