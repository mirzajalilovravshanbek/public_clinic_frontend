<template>
  <div class="rmk-bg">
    <p class="text-center header-text">404</p>
    <p class="text-center body-text">Page Not Found</p>
    <p class="text-center">
      <b-button
        variant="primary"
        size="lg"
        :to="{ path: '/patient/index' }"
        class="text-white m-4"
        >Бош Саҳифа</b-button
      >
    </p>
  </div>
</template>
<style scoped>
.rmk-bg {
  height: 100vh;
  background-image: url("../assets/img/1.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}
.header-text {
  font-weight: 500;
  font-size: 110pt;
  padding-top: 10%;
}
.body-text {
  font-weight: 700;
  font-size: 45pt;
  padding-top: 10%;
}
</style>
