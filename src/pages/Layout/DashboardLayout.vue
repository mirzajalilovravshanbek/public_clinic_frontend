<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <p class="rmk-margin">
          <b-icon icon="columns-gap" font-scale="1.5"></b-icon>
        </p>
        <p>{{ $t("Навбатлар Рўйҳати") }}</p>
      </sidebar-link>
      <sidebar-link to="/patient/index">
        <p class="rmk-margin">
          <b-icon icon="person-lines-fill" font-scale="1.7"></b-icon>
        </p>
        <p>{{ $t("Регистрация") }}</p>
      </sidebar-link>
      <sidebar-link to="/archive/index">
        <p class="rmk-margin">
          <b-icon icon="archive-fill" font-scale="1.7"></b-icon>
        </p>
        <p>{{ $t("Архив") }}</p>
      </sidebar-link>
      <div class="mt-2" v-if="role === $store.state.ITMED">
        <sidebar-link to="/reports/index">
          <p class="mr-2"><b-icon icon="journals" font-scale="1.7"></b-icon></p>
          <p>{{ $t("Ҳисоботлар") }}</p>
        </sidebar-link>
        <sidebar-link to="/patientcrud/index">
          <p class="mr-2">
            <b-icon icon="person-plus-fill" font-scale="1.7"></b-icon>
          </p>
          <p>{{ $t("Беморлар") }}</p>
        </sidebar-link>
        <sidebar-link to="/branch/index">
          <p class="mr-2"><b-icon icon="building" font-scale="1.7"></b-icon></p>
          <p>{{ $t("Филиаллар") }}</p>
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
          <p>{{ $t("Шифокор Бўлими") }}</p>
        </sidebar-link>
        <sidebar-link to="/doctor/index">
          <p class="rmk-margin">
            <b-icon icon="people-fill" font-scale="1.7"></b-icon>
          </p>
          <p>{{ $t("Шифокор") }}</p>
        </sidebar-link>
        <sidebar-link to="/employees/index">
          <p class="rmk-margin">
            <b-icon icon="person-fill" font-scale="1.7"></b-icon>
          </p>
          <p>{{ $t("Ходим") }}</p>
        </sidebar-link>
        <sidebar-link to="/room/doctorroom/index">
          <p class="mr-2">
            <b-icon icon="door-open-fill" font-scale="1.7"></b-icon>
          </p>
          <p>{{ $t("Хона") }}</p>
        </sidebar-link>
        <sidebar-link to="/inspectioncategory/index">
          <p class="mr-2">
            <b-icon icon="journal-medical" font-scale="1.7"></b-icon>
          </p>
          <p>{{ $t("Текширув Бўлимлари") }}</p>
        </sidebar-link>
        <sidebar-link to="/inspectionfolder/index">
          <p class="mr-2">
            <b-icon icon="folder-fill" font-scale="1.7"></b-icon>
          </p>
          <p>{{ $t("Текширув Папкалари") }}</p>
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
          <p>{{ $t("Текширувлар") }}</p>
        </sidebar-link>
        <sidebar-link to="/pill/index">
          <p class="mr-2">
            <b-icon icon="circle-half" font-scale="1.7"></b-icon>
          </p>
          <p>{{ $t("Дори") }}</p>
        </sidebar-link>
      </div>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

    <!-- error alert start -->
    <div
      :class="
        $store.state.errors != ''
          ? 'alert alert-danger text-center p-1 notifications active'
          : ''
      "
      v-if="$store.state.errors != ''"
    >
      <button
        type="button"
        aria-hidden="true"
        class="close"
        @click="$store.state.errors = ''"
      >
        <b-icon font-scale="2" icon="x"></b-icon>
      </button>
      <h4>
        <i class="fas fa-exclamation-triangle"></i>&nbsp;
        {{ $t("Хатолик") }} {{ Interval() }}
      </h4>
      <p class="text-center">{{ $store.state.errors }}</p>
      <ol v-if="$store.state.arr_errors.length > 0 && $store.state.arr_errors != undefined">
        <li v-for="(item, index) in $store.state.arr_errors" :key="index">
          {{item.msg}}
        </li>
      </ol>
    </div>
    <!-- error alert end -->

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
  },
  methods: {
    Interval() {
      setTimeout(() => {
        this.$store.state.errors = "";
        this.$store.state.arr_errors = [];
      }, 5000);
    }
  }
};
</script>
<style scoped>
.notifications {
  z-index: 5;
  position: absolute;
  top: 0%;
  left: 15%;
  width: 75%;
}
.rmk-margin {
  margin-right: 10px !important;
}
</style>
