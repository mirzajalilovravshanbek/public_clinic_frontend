<template>
  <b-container fluid="lg">
    <md-card>
      <md-card-header data-background-color="green">
        <b-row>
          <b-col md="4" sm="4" lg="4" xl="4">
            <b-button
              :to="{ path: '/room/patientroom/index' }"
              size="md"
              variant="info"
              v-b-tooltip.hover.v-info
              title="Бош саҳифа"
            >
              <b-icon icon="house-door"></b-icon>
            </b-button>
          </b-col>
          <b-col md="4" sm="4" lg="4" xl="4" class="text-center">
            <h4 class="title">Хона қўшиш</h4>
          </b-col>
          <b-col md="4" sm="4" lg="4" xl="4"> </b-col>
        </b-row>
      </md-card-header>
      <md-card-content>
        <form>
          <b-row class="my-1">
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="door-open-fill" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Хона Рақами</label>
                <md-input v-model="datas.full_name" md-dense></md-input>
              </md-field>
            </b-col>
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="cash" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Нарҳи</label>
                <md-input
                  v-model="datas.price"
                  md-dense
                  type="number"
                ></md-input>
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
      full_name: "",
      price: null,
      section_id: null
    },
    sections: [],
    sending: false
  }),
  mounted() {
    let self = this;

    //get list of sections => bo'limlarni olish
    axios({
      url: "universal/section_list",
      method: "get",
      params: {
        id: localStorage.getItem("branch_id")
      }
    }).then(function(response) {
      self.sections = response.data.data;
    });

    //update room => xonani tahrirlash
    if (self.$route.path != "/room/patientroom/create") {
      let id = self.$route.params.id;

      axios({
        method: "get",
        url: "staff/room_patient_index",
        params: {
          id: id
        }
      }).then(function(response) {
        self.datas = response.data.data;
        self.datas.price = parseFloat(response.data.data.price);
      });
    }
  },
  methods: {
    Save() {
      let self = this;
      self.sending = true;
      if (self.$route.path == "/room/patientroom/create") {
        var methods = "post";
        var action = "staff/room_patient_create";
        self.datas.branch_id = localStorage.getItem("branch_id");
      } else {
        var methods = "post";
        var action = "staff/room_patient_update?id=" + self.$route.params.id;
      }
      axios({
        method: methods,
        url: action,
        data: self.datas
      }).then(function(response) {
        self.sending = false;
        if (response.data.status == true) {
          self.$router.push("/room/patientroom/index");
        } else {
          alert(response.data.message);
        }
      });
    },
    Cancel() {
      this.datas.full_name = "";
      this.datas.price = null;
      this.datas.section_id = null;
    }
  }
};
</script>
