<template>
  <router-view></router-view>
</template>

<script>
export default {
  mounted() {
    if (!this.$cookies.isKey("user")) {
      this.$router.push({ name: "Login" }).catch(error => {
        if (error.name != "NavigationDuplicated") {
          throw error;
        }
      });
    }
  }
};
</script>
