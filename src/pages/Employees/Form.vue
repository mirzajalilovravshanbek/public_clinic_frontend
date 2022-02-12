<template>
  <b-container fluid="lg">
    <md-card>
      <md-card-header data-background-color="green">
        <b-row>
          <b-col md="4" sm="4" lg="4" xl="4">
            <b-button
              :to="{ path: '/employees/index' }"
              size="md"
              variant="info"
              v-b-tooltip.hover.v-info
              title="Бош саҳифа"
            >
              <b-icon icon="house-door"></b-icon>
            </b-button>
          </b-col>
          <b-col md="4" sm="4" lg="4" xl="4" class="text-center">
            <h4 class="title">Ҳодим қўшиш</h4>
          </b-col>
          <b-col md="4" sm="4" lg="4" xl="4"> </b-col>
        </b-row>
      </md-card-header>
      <md-card-content>
        <form>
          <b-row class="my-1">
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="person" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>ФИШ</label>
                <md-input v-model="datas.username" md-dense></md-input>
              </md-field>
            </b-col>
            <b-col md="4" sm="4" lg="4" xl="4">
              <b-icon icon="card-list" font-scale="1.6"></b-icon>
              <md-icon></md-icon>
              <label>Бўлим</label>
              <v-select
                :clearable="true"
                :options="sections"
                v-model="datas.section_id"
                :reduce="full_name => full_name.id"
                label="full_name"
              >
              </v-select>
            </b-col>
            <b-col md="4" sm="4" lg="4" xl="4">
              <b-icon icon="bookmark-star" font-scale="1.6"></b-icon>
              <md-icon></md-icon>
              <label>Ҳуқуқи</label>
              <v-select
                :clearable="true"
                :options="positions"
                v-model="datas.position_id"
                :reduce="full_name => full_name.id"
                label="full_name"
              >
              </v-select>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="shield-lock" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Парол</label>
                <md-input v-model="datas.password" md-dense></md-input>
              </md-field>
            </b-col>
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="percent" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Асосий Улуши (%)</label>
                <md-input v-model="datas.percent_price" md-dense></md-input>
              </md-field>
            </b-col>
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="percent" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Хонадан Оладиган Улуши (%)</label>
                <md-input v-model="datas.percent_room" md-dense></md-input>
              </md-field>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="percent" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Консультациядан Оладиган Улуши (%)</label>
                <md-input
                  v-model="datas.percent_consultation"
                  md-dense
                ></md-input>
              </md-field>
            </b-col>
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="percent" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Текширувлардан Оладиган Улуши (%)</label>
                <md-input
                  v-model="datas.percent_inspection"
                  md-dense
                ></md-input>
              </md-field>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col md="4" sm="4" lg="4" xl="4">
              <b-button
                size="md"
                variant="success"
                @click="Save()"
                :disabled="sending"
              >
                <b-spinner small v-if="sending"></b-spinner>
                <b-icon icon="clipboard-check"></b-icon>
                Сақлаш
              </b-button>
              &nbsp; &nbsp;
              <b-button
                size="md"
                variant="outline-danger"
                @click="
                  Cancel();
                  sending = false;
                "
              >
                <b-icon icon="clipboard-x"></b-icon>
                Бекор қилиш
              </b-button>
            </b-col>
          </b-row>
        </form>
      </md-card-content>
    </md-card>
  </b-container>
</template>
<script>
export default {
  data: () => ({
    datas: {
      username: "",
      position_id: null,
      section_id: null,
      password: null,
      percent_price: null,
      percent_room: null,
      percent_consultation: null,
      percent_inspection: null
    },
    positions: [],
    sections: [],
    sending: false
  }),
  mounted() {
    let self = this;

    // //get list of sections => bo'limlarni olish
    // axios({
    //   url: "universal/section_list",
    //   method: "get",
    //   params: {
    //     id: localStorage.getItem("branch_id")
    //   }
    // }).then(function(response) {
    //   self.sections = response.data.data;
    // });

    // //get list of positions => rollarni olish
    // axios.get("universal/position_list").then(function(response) {
    //   self.positions = response.data.data;
    // });

    // //update patient => xodimni tahrirlash
    // if (self.$route.path != "/employees/create") {
    //   let id = self.$route.params.id;

    //   axios({
    //     method: "get",
    //     url: "staff/get_staff",
    //     params: {
    //       id: id
    //     }
    //   }).then(function(response) {
    //     self.datas = response.data.data;
    //   });
    // }
  },
  methods: {
    Save() {
      let self = this;
      self.sending = true;
      if (self.$route.path == "/employees/create") {
        var methods = "post";
        var action = "staff/create_staff";
        self.datas.branch_id = localStorage.getItem("branch_id");
      } else {
        var methods = "post";
        var action = "staff/update_staff?id=" + self.$route.params.id;
      }
      axios({
        method: methods,
        url: action,
        data: self.datas
      }).then(function(response) {
        self.sending = false;
        self.$router.push("/employees/index");
      });
    },
    Cancel() {
      (this.datas.full_name = ""),
        (this.datas.position_id = null),
        (this.datas.section_id = null),
        (this.datas.password = null),
        (this.datas.percent_price = null),
        (this.datas.percent_room = null),
        (this.datas.percent_consultation = null),
        (this.datas.percent_inspection = null);
    }
  }
};
</script>
