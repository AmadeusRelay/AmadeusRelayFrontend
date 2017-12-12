<template>
    <div id="main-section">
      <div class="container-fluid" v-bind:class="{'full-container': !$route.meta.plainLayout, 'half-container': $route.meta.plainLayout}">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-4">
              <img id="logo" src="http://amadeusrelay.org/img/logo_nome_transparente.png">
            </div>
            <div v-if="$route.meta.plainLayout" class="col-md-8">
              <div class="col-md-3 pull-right">
                <button class="js-add btn btn-block uppercase" type="button">Restart</button> 
              </div>
            </div>
          </div>
        </div>
        <router-view></router-view>
      </div>
        <div v-if="$route.meta.plainLayout" class="code-container">
        </div>
    </div>
</template>

<style scoped>
#main-section{
  background-image: linear-gradient(to bottom, #433c7f, #2f295f);
  background-size: cover;
  overflow: hidden;
  height: 100vh;
}

#main-section .container-fluid {
    padding-top: 75px;
}

#main-section .full-container {
    width: 100%;
    padding-left: 100px;
}

#main-section .half-container {
    width: 70%;
    padding-left: 100px;
    float: left;
}

#main-section .code-container {
    width: 30%;
    background-color: #26204a;
    box-shadow: inset 2px 1px 10px 0 rgba(35, 31, 32, 0.4);
    height: 100vh;
}

#logo {
  width: 250px;
}

button.btn{
  border-radius: 4px;
  color: white;
  cursor: pointer;
  border: solid 1px #76729f;
  background-color: transparent;
  height: 50px;
  text-transform: uppercase;
}
</style>