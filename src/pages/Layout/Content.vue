<template>
  <div class="rmk-background">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {};
</script>
<style>
.rmk-background {
  /* background-image: url("../../assets/img/1.jpg");
  background-size: 100%;
  background-repeat: repeat-y;
  background-position: center; */
  margin-top: -15px;
  padding: 0 5px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

 {
  opacity: 0;
}
</style>
