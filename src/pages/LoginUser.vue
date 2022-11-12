<template>
  <div class="rmk-bg">
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

    <b-container fluid class="rmk-back">
      <md-card class="rmk-login-box">
        <b-row>
          <b-col md="12" sm="12" lg="12" xl="12" style="height: 150px">
            <img src="../assets/img/header.png" class="rmk-login-img" />
          </b-col>
          <b-col md="12" sm="12" lg="12" xl="12" class="rmk-label">
            <span>Кириш Ойнаси</span>
          </b-col>
          <b-col md="12" sm="12" lg="12" xl="12">
            <div class="rmk-district">
              <md-card style="z-index: 11;" class="mb-0 mt-1">
                <v-select
                  :clearable="true"
                  :options="branches"
                  v-model="datas.branch_id"
                  :reduce="name => name.id"
                  label="name"
                  placeholder="Филиални танланг..."
                  @input="GetUsers()"
                >
                </v-select>
              </md-card>
            </div>
          </b-col>
          <b-col md="12" sm="12" lg="12" xl="12">
            <div class="rmk-district">
              <md-card style="z-index: 10;" class="my-1">
                <v-select
                  :clearable="true"
                  :options="users"
                  v-model="datas.username"
                  :reduce="username => username.username"
                  label="username"
                  placeholder="Ходимни танланг..."
                  @input="CheckUser()"
                >
                </v-select>
                <!-- <md-field class="m-0 px-1">
                  <label style="color:#000!important;">Ходим</label>
                  <md-input
                    v-model="datas.username"
                    type="text"
                    @blur="CheckUser()"
                  ></md-input>
                </md-field> -->
              </md-card>
              <small class="alert alert-danger d-block p-0 m-0" v-if="checkUser"
                >Ходимни тўлдириш шарт</small
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
              <small
                class="alert alert-danger d-block p-0 m-0"
                v-if="checkPassword"
                >Паролни тўлдириш шарт</small
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
              class="rmk-center mt-2"
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
              class="rmk-center-back mt-2"
              variant="outline-danger"
              block
              style="color:#000"
              @click="Clear()"
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
      branch_id: null,
      username: null,
      password: null
    },
    branches: [],
    users: [],
    checkBranch: false,
    checkUser: false,
    checkPassword: false,
    sending: false
  }),
  async mounted() {
    let self = this;
    //filiallar ro'yhati
    try {
      const response = await self.axios.get("api/branch");
      self.branches = response.data;
    } catch (error) {}
    if (localStorage.getItem("branch_id") !== null) {
      self.datas.branch_id = parseInt(localStorage.getItem("branch_id"));
      await self.GetUsers();
    }
  },
  methods: {
    Interval() {
      setTimeout(() => {
        this.$store.state.errors = "";
        this.$store.state.arr_errors = [];
      }, 5000);
    },
    async GetUsers() {
      let self = this;
      if (localStorage.getItem("branch_id") === null) {
        localStorage.setItem("branch_id", self.datas.branch_id);
      }
      //usernamelar ro'yhati
      try {
        const response = await self.axios.get(
          "api/user/branch/" + self.datas.branch_id
        );
        self.users = response.data;
      } catch (error) {}
    },
    CheckUser() {
      let self = this;
      self.datas.username == null
        ? (self.checkUser = true)
        : (self.checkUser = false);
    },
    CheckPassword() {
      let self = this;
      self.datas.password == null
        ? (self.checkPassword = true)
        : (self.checkPassword = false);
    },
    async Send() {
      let self = this;
      self.CheckUser();
      self.CheckPassword();
      if (self.checkUser == false && self.checkPassword == false) {
        self.sending = true;
        try {
          const response = await axios.post("api/user/login", self.datas);
          if (response) {
            localStorage.setItem("oid", response.data.id);
            localStorage.setItem("branch_id", response.data.branch_id);
            localStorage.setItem("did", response.data.doctor_id);
            localStorage.setItem("cid", response.data.inspection_category_id);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("t", response.data.token);
            self.$router.push({ path: "/patient/index" });
          }
        } catch (e) {
          self.datas.password = null;
        }
        self.sending = false;
      }
    },
    Clear() {
      (this.datas.branch_id = null),
        (this.datas.username = null),
        (this.datas.password = null);
      this.sending = false;
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
.rmk-back {
  text-align: center;
  height: 100vh;
}
.notifications {
  z-index: 5;
  position: absolute;
  top: 0%;
  left: 15%;
  width: 75%;
}
.rmk-login-box {
  width: 400px;
  height: 520px;
  top: 5%;
  border-radius: 10px;
  background-color: #7579ff !important;
}
.rmk-login-img {
  width: 280px;
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
