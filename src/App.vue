<template>
  <router-view></router-view>
</template>

<script>
export default {
  mounted() {
    if (!localStorage.getItem("t")) {
      this.$router.push({ name: "LoginUser" }).catch(error => {
        if (error.name != "NavigationDuplicated") {
          throw error;
        }
      });
    }
  }
};
</script>
