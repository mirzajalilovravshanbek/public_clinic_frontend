<template>
  <div class="rmk-bg">
    <!-- alert start -->
    <div class="container-fluid">
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
    </div>
    <!-- alert end -->
    <b-container>
      <md-card class="rmk-login-box">
        <b-row>
          <b-col md="12" sm="12" lg="12" xl="12" style="height: 200px">
            <img src="../assets/img/isti.png" class="rmk-login-img" />
          </b-col>
          <b-col md="12" sm="12" lg="12" xl="12" class="rmk-label">
            <span>Кириш Ойнаси</span>
          </b-col>
          <b-col md="12" sm="12" lg="12" xl="12">
            <div class="rmk-district">
              <md-card style="z-index: 4;" class="mb-1">
                <v-select
                  :clearable="true"
                  :options="regions"
                  v-model="datas.region_id"
                  :reduce="name_oz => name_oz.id"
                  label="name_oz"
                  placeholder="Вилоятни танланг..."
                  @input="GetRegion()"
                >
                </v-select>
              </md-card>
              <span
                class="alert alert-danger d-block p-1 m-0"
                v-if="checkRegion"
                >Вилоятни танлаш шарт</span
              >
            </div>
          </b-col>
          <b-col md="12" sm="12" lg="12" xl="12">
            <div class="rmk-district">
              <md-card style="z-index: 3;" class="mb-1">
                <v-select
                  :clearable="true"
                  :options="districts"
                  v-model="datas.district_id"
                  :reduce="name_oz => name_oz.id"
                  label="name_oz"
                  placeholder="Туманни танланг..."
                  @input="GetDistrict()"
                >
                </v-select>
              </md-card>
              <span
                class="alert alert-danger d-block p-1 m-0"
                v-if="checkDistrict"
                >Туманни танлаш шарт</span
              >
            </div>
          </b-col>
          <b-col md="12" sm="12" lg="12" xl="12">
            <div class="rmk-district">
              <md-card class="mb-1">
                <v-select
                  :clearable="true"
                  :options="branches"
                  v-model="datas.branch_id"
                  :reduce="full_name => full_name.id"
                  label="full_name"
                  placeholder="Муассасани танланг..."
                  @input="GetBranch()"
                >
                </v-select>
              </md-card>
              <span
                class="alert alert-danger d-block p-1 m-0"
                v-if="checkBranch"
                >Муассасани танлаш шарт</span
              >
            </div>
          </b-col>
          <b-col
            md="4"
            offset-md="4"
            sm="4"
            offset-sm="4"
            lg="4"
            offset-lg="4"
            xl="4"
            offset-xl="4"
          >
            <b-button
              size="lg"
              class="rmk-center mt-4"
              variant="outline-primary"
              block
              @click="LoginUser()"
              :disabled="log_in"
            >
              <b-spinner small v-if="log_in"></b-spinner>
              Кириш
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
      region_id: null,
      district_id: null,
      branch_id: null
    },
    regions: [],
    districts: [],
    branches: [],
    checkRegion: false,
    checkDistrict: false,
    checkBranch: false,
    log_in: false
  }),
  mounted() {
    let self = this;
    //get list of regions => viloyatlar ro'yhatinini olish
    axios.get("universal/region_list").then(function(response) {
      self.regions = response.data.data;
    });

    if (localStorage.region_id) {
      self.datas.region_id = parseInt(localStorage.region_id);
    }
    if (localStorage.district_id) {
      self.datas.district_id = parseInt(localStorage.district_id);
      self.GetRegion();
    }
    if (localStorage.branch_id) {
      self.datas.branch_id = parseInt(localStorage.branch_id);
      self.GetDistrict();
    }
  },
  methods: {
    GetRegion() {
      let self = this;
      if (self.datas.region_id != null) {
        self.checkRegion = false;
        //get list of districts => tumanlar ro'yhatinini olish
        axios({
          method: "get",
          url: "universal/district_list",
          params: {
            id: self.datas.region_id
          }
        }).then(function(response) {
          self.districts = response.data.data;
        });
      } else {
        self.checkRegion = true;
      }
    },
    GetDistrict() {
      let self = this;
      if (self.datas.district_id != null) {
        self.checkDistrict = false;
        //get list of branches => muassasalar ro'yhatinini olish
        axios({
          method: "get",
          url: "universal/branch_index",
          params: {
            id: self.datas.district_id
          }
        }).then(function(response) {
          self.branches = response.data.data;
        });
      } else {
        self.checkDistrict = true;
      }
    },
    GetBranch() {
      let self = this;
      self.datas.branch_id == null
        ? (self.checkBranch = true)
        : (self.checkBranch = false);
    },
    LoginUser() {
      let self = this;
      self.log_in = true;
      if (
        self.datas.region_id != null &&
        self.datas.district_id != null &&
        self.datas.branch_id != null
      ) {
        localStorage.setItem("region_id", self.datas.region_id);
        localStorage.setItem("district_id", self.datas.district_id);
        localStorage.setItem("branch_id", self.datas.branch_id);
        self.$router.push({ name: "LoginUser" });
      } else {
        self.$store.state.errors = "Барча майдонларни тўлдиринг!";
      }
      self.log_in = false;
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
  height: 80%;
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
  margin: 0 25px;
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
}
</style>
