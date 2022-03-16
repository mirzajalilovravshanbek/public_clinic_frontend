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
import i18n from "./i18n";
window.axios = require("axios");
window.axios.defaults.baseURL = "http://fveak.uz:3000/";
// window.axios.defaults.baseURL = 'http://192.168.0.126:8081/';

window.axios.interceptors.request.use(req => {
  req.headers.authorization = "Bearer " + localStorage.getItem("t");
  req.headers.contentType = "application/json";
  return req;
});

window.axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status == 401) {
      store.state.errors = error.response.data.message;
      router.push("/loginuser");
    } else if (error.response.status == 400) {
      store.state.errors = error.response.data.message;
    } else if (error.response.status == 404) {
      router.push("/404");
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
  i18n,
  store
});
