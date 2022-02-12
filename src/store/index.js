import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export const store = new Vuex.Store({
  state: {
    ITMED: "itmed",
    KASSA: "kassa",
    DOCTOR: "doctor",
    REGISTRATION: "Register",
    LABARATORY: "labaratory",
    UZI: "uzi",
    errors: ""
  }
});
