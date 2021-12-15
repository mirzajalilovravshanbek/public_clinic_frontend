<template>
  <div class="rmk-bg">
    <!-- alert start -->
    <div class="row justify-content-md-center">
      <div
        class="col-lg-10 col-md-10 col-sm-10 col-xl-10 alert alert-danger text-center p-1"
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
    <!-- alert end -->
    <b-container>
      <md-card class="rmk-login-box">
        <b-row>
          <b-col md="12" sm="12" lg="12" xl="12">
            <!-- <b-alert variant="success" show>Success Alert</b-alert> -->
          </b-col>
          <b-col md="12" sm="12" lg="12" xl="12" style="height: 180px">
            <img src="../assets/img/isti.png" class="rmk-login-img" />
          </b-col>
          <b-col md="12" sm="12" lg="12" xl="12" class="rmk-label">
            <span>Кириш Ойнаси</span>
          </b-col>
          <b-col md="12" sm="12" lg="12" xl="12">
            <div class="rmk-district">
              <md-card style="z-index: 10;" class="mb-1">
                <v-select
                  :clearable="true"
                  :options="users"
                  v-model="datas.full_name"
                  :reduce="full_name => full_name.full_name"
                  label="full_name"
                  placeholder="Ходимни танланг..."
                  @input="CheckUser()"
                >
                </v-select>
              </md-card>
              <span class="alert alert-danger d-block p-1 m-0" v-if="checkUser"
                >Ходимни танлаш шарт</span
              >
            </div>
          </b-col>
          <b-col md="12" sm="12" lg="12" xl="12">
            <div class="rmk-district">
              <md-card class="my-1 p-0">
                <md-field class="m-0 px-1">
                  <label style="color:#000!important;">Парол</label>
                  <md-input
                    v-model="datas.password"
                    type="password"
                    @blur="CheckPassword()"
                  ></md-input>
                </md-field>
              </md-card>
              <span
                class="alert alert-danger d-block p-1 m-0"
                v-if="checkPassword"
                >Паролни тўлдириш шарт</span
              >
            </div>
          </b-col>
          <b-col
            md="5"
            offset-md="1"
            sm="5"
            offset-sm="1"
            lg="5"
            offset-lg="1"
            xl="5"
            offset-xl="1"
          >
            <b-button
              size="lg"
              class="rmk-center mt-4"
              variant="outline-primary"
              block
              :disabled="sending"
              @click="Send()"
            >
              <b-spinner small v-if="sending"></b-spinner>
              Кириш
            </b-button>
          </b-col>
          <b-col md="5" sm="5" lg="5" xl="5">
            <b-button
              size="lg"
              class="rmk-center-back mt-4"
              variant="outline-danger"
              block
              style="color:#000"
              :to="{ path: '/login' }"
            >
              Бекор Қилиш
            </b-button>
          </b-col>
        </b-row>
      </md-card>
    </b-container>
  </div>
</template>
<script>
export default {
  data: () => ({
    datas: {
      full_name: null,
      password: null
    },
    users: [],
    checkUser: false,
    checkPassword: false,
    sending: false
  }),
  mounted() {
    let self = this;
    if (localStorage.branch_id) {
      //get list of users => foydalanuvchilar ro'yhatinini olish
      axios({
        url: "staff/list",
        method: "get",
        params: {
          id: parseInt(localStorage.branch_id)
        }
      }).then(function(response) {
        self.users = response.data.data;
      });
    }
  },
  methods: {
    CheckUser() {
      let self = this;
      self.datas.full_name == null
        ? (self.checkUser = true)
        : (self.checkUser = false);
    },
    CheckPassword() {
      let self = this;
      self.datas.password == null
        ? (self.checkPassword = true)
        : (self.checkPassword = false);
    },
    Send() {
      let self = this;
      self.CheckUser();
      self.CheckPassword();
      if (self.checkUser == false && self.checkPassword == false) {
        self.sending = true;
        axios({
          method: "post",
          url: "staff/login",
          data: self.datas
        }).then(function(response) {
          self.sending = false;
          // console.log(response.data)
          if (response.data.status == true) {
            self.$cookies.set("user", response.data.data);
            self.$store.state.role = response.data.data.position;
            self.$router.push({ path: "dashboard" });
          } else {
            // console.log(response.data)
            self.$store.state.errors = response.data.message;
            self.datas.password = null;
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.rmk-bg {
  height: 100vh;
  background-image: url("../assets/img/1.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}
.rmk-login-box {
  width: 400px;
  height: 520px;
  position: absolute;
  top: 5%;
  left: 35%;
  border-radius: 10px;
  background-color: #7579ff !important;
}
.rmk-login-img {
  width: 260px;
  position: absolute;
  top: 34%;
  left: 18%;
}
.rmk-district {
  margin: 10px 25px;
}
.rmk-label {
  font-size: 26px;
  color: #fff;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
  display: block;
}
.rmk-center {
  font-size: 18px;
  color: #000;
  line-height: 1.2;
  text-align: center;
  background-color: #fff;
  display: block;
}
.rmk-center-back {
  font-size: 18px;
  color: #fff;
  line-height: 1.2;
  background-color: #fff;
}
</style>
