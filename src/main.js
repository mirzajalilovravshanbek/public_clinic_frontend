// =========================================================
// * Vue Material Dashboard - v1.4.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vue-material-dashboard
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/vue-material-dashboard/blob/master/LICENSE.md)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";
import axios from "axios";
import VueAxios from "vue-axios";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
// router setup
import routes from "./routes/routes";
//vue-select
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import Notifications from "./components/NotificationPlugin";
// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
//cookies
import VueCookies from "vue-cookies";
Vue.use(VueCookies);
Vue.$cookies.config("1d");
//session
import VueSession from "vue-session";
Vue.use(VueSession);

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";

import Chartist from "chartist";
Vue.use(VueAxios, axios);
// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active"
});

Vue.prototype.$Chartist = Chartist;

// Vue.use(axios);
Vue.use(VueRouter);
Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);
import { store } from "./store";
window.axios = require("axios");
window.axios.defaults.baseURL = "http://localhost:3000/";
// window.axios.defaults.baseURL = 'http://192.168.0.126:8081/';

window.axios.interceptors.request.use(req => {
  req.headers.authorization = "Bearer " + localStorage.getItem("token");
  req.headers.contentType = "application/json";
  return req;
});

window.axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // console.log(error + "");

    if (error.response.status == 401) {
      store.state.errors = error.message;
      router.push("/loginuser");
    } else if (error.response.status == 400) {
      store.state.errors = error.response.data.message;
    } else if (error.response.status == 404) {
      store.state.errors = error.response.data.message;
    } else {
      store.state.errors = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router,
  store
  // data: {
  //   Chartist: Chartist
  // }
});
