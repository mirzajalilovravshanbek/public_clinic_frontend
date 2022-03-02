<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard" target="_blank">
        <p class="rmk-margin">
          <b-icon icon="columns-gap" font-scale="1.5"></b-icon>
        </p>
        <p>Навбатлар Рўйҳати</p>
      </sidebar-link>
      <sidebar-link to="/patient/index">
        <p class="rmk-margin">
          <b-icon icon="person-lines-fill" font-scale="1.7"></b-icon>
        </p>
        <p>Регистрация</p>
      </sidebar-link>
      <div class="mt-2" v-if="role === $store.state.ITMED">
        <sidebar-link to="/patientcrud/index">
          <p class="mr-2">
            <b-icon icon="person-plus-fill" font-scale="1.7"></b-icon>
          </p>
          <p>Беморлар</p>
        </sidebar-link>
        <!-- <sidebar-link to="/reports/index">
          <p class="mr-2"><b-icon icon="journals" font-scale="1.7"></b-icon></p>
          <p>Ҳисоботлар</p>
        </sidebar-link> -->
        <sidebar-link to="/branch/index">
          <p class="mr-2"><b-icon icon="building" font-scale="1.7"></b-icon></p>
          <p>Филиаллар</p>
        </sidebar-link>
        <sidebar-link to="/doctorcategory/index">
          <p class="mr-2">
            <b-iconstack font-scale="1.7">
              <b-icon
                stacked
                icon="card-checklist"
                scale="0.60"
                shift-v="-1"
              ></b-icon>
              <b-icon stacked icon="clipboard"></b-icon>
            </b-iconstack>
          </p>
          <p>Шифокор Бўлими</p>
        </sidebar-link>
        <sidebar-link to="/doctor/index">
          <p class="rmk-margin">
            <b-icon icon="people-fill" font-scale="1.7"></b-icon>
          </p>
          <p>Шифокорлар</p>
        </sidebar-link>
        <sidebar-link to="/employees/index">
          <p class="rmk-margin">
            <b-icon icon="person-fill" font-scale="1.7"></b-icon>
          </p>
          <p>Ҳодимлар</p>
        </sidebar-link>
        <sidebar-link to="/room/doctorroom/index">
          <p class="mr-2">
            <b-icon icon="door-open-fill" font-scale="1.7"></b-icon>
          </p>
          <p>Хоналар</p>
        </sidebar-link>
        <sidebar-link to="/inspectioncategory/index">
          <p class="mr-2">
            <b-icon icon="journal-medical" font-scale="1.7"></b-icon>
          </p>
          <p>Текширув Бўлимлари</p>
        </sidebar-link>
        <sidebar-link to="/inspectionfolder/index">
          <p class="mr-2">
            <b-icon icon="folder-fill" font-scale="1.7"></b-icon>
          </p>
          <p>Текширув Папкалари</p>
        </sidebar-link>
        <sidebar-link to="/inspections/index">
          <p class="mr-2">
            <b-iconstack font-scale="1.7">
              <b-icon
                stacked
                icon="card-checklist"
                scale="0.60"
                shift-v="-1"
              ></b-icon>
              <b-icon stacked icon="clipboard"></b-icon>
            </b-iconstack>
          </p>
          <p>Текширувлар</p>
        </sidebar-link>
        <sidebar-link to="/pill/index">
          <p class="mr-2">
            <b-icon icon="circle-half" font-scale="1.7"></b-icon>
          </p>
          <p>Дорилар</p>
        </sidebar-link>
      </div>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <!-- alert start -->
      <div class="container-fluid" style="position: absolute;">
        <div class="row justify-content-md-center">
          <div
            class="col-lg-11 col-md-11 col-sm-11 col-xl-11 alert alert-danger text-center p-1"
            style="z-index: 5;"
            v-if="$store.state.errors != ''"
          >
            <button
              type="button"
              aria-hidden="true"
              class="close"
              @click="$store.state.errors = ''"
            >
              ×
            </button>
            <p><i class="fas fa-exclamation-triangle"></i>&nbsp; Хатолик</p>
            <span>{{ $store.state.errors }}</span>
          </div>
        </div>
      </div>
      <!-- alert end -->

      <dashboard-content> </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu
  },
  data() {
    return {
      role: null,
      sidebarBackground: "green",
      sidebarBackgroundImage: require("@/assets/img/12.jpg")
    };
  },
  mounted() {
    this.role = localStorage.getItem("role");
  }
};
</script>
<style scoped>
.rmk-margin {
  margin-right: 10px !important;
}
</style>
