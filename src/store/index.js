import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export const store = new Vuex.Store({
  state: {
    KASSA: "kassa",
    ITMED: "Administrator",
    DOCTOR: "Doctor",
    REGISTRATION: "Register",
    LABARATORY: "Inspector",
    WAITING: "waiting",
    COMPLETE: "complete",
    DELETED: "deleted",
    errors: "",
    lang: "uz"
  }
});
