<template>
  <b-container fluid>
    <md-card>
      <md-card-header data-background-color="green">
        <b-row>
          <b-col md="4" sm="4" lg="4" xl="4">
            <b-button
              :to="{ path: '/doctor/index' }"
              size="md"
              variant="info"
              v-b-tooltip.hover.v-info
              title="Бош саҳифа"
            >
              <b-icon icon="house-door"></b-icon>
            </b-button>
          </b-col>
          <b-col md="4" sm="4" lg="4" xl="4" class="text-center">
            <h4 class="title">Шифокор қўшиш</h4>
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
                <label>Шифокор<sup class="text-danger">*</sup></label>
                <md-input v-model="datas.name" md-dense></md-input>
              </md-field>
            </b-col>
            <b-col md="4" sm="4" lg="4" xl="4">
              <b-icon icon="card-list" font-scale="1.6"></b-icon>
              <md-icon></md-icon>
              <label>Шифокор Бўлими<sup class="text-danger">*</sup></label>
              <v-select
                :clearable="true"
                :options="categories"
                v-model="datas.category_id"
                :reduce="name => name.id"
                label="name"
                placeholder="Бўлимини танланг..."
              >
              </v-select>
            </b-col>
            <b-col md="4" sm="4" lg="4" xl="4">
              <b-icon icon="card-list" font-scale="1.6"></b-icon>
              <md-icon></md-icon>
              <label>Филиал<sup class="text-danger">*</sup></label>
              <v-select
                :clearable="true"
                :options="branches"
                v-model="datas.branch_id"
                :reduce="name => name.id"
                label="name"
                placeholder="Филиални танланг..."
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
      name: null,
      branch_id: null,
      category_id: null
    },
    branches: [],
    categories: [],
    sending: false
  }),
  async mounted() {
    let self = this;

    //filiallar ro'yhati
    try {
      const response = await self.axios.get("api/branch");
      self.branches = response.data;
    } catch (error) {}

    //shifokor bo'limlari ro'yhati
    try {
      const response = await self.axios.get("api/doctor_category");
      self.categories = response.data;
    } catch (error) {}

    //update room => xonani tahrirlash
    if (self.$route.path != "/doctor/create") {
      let id = self.$route.params.id;

      try {
        const response = await self.axios.get("api/doctor/id/" + id);
        self.datas = response.data;
      } catch (error) {}
    }
  },
  methods: {
    async Save() {
      let self = this;
      self.sending = true;
      if (self.$route.path == "/doctor/create") {
        var methods = "post";
        var action = "api/doctor";
      } else {
        var methods = "patch";
        var action = "api/doctor/id/" + self.$route.params.id;
      }
      try {
        const response = await axios({
          method: methods,
          url: action,
          data: self.datas
        });
        self.$router.push("/doctor/index");
      } catch (error) {}
      self.sending = false;
    },
    Cancel() {
      this.datas.name = null;
      this.datas.branch_id = null;
      this.datas.category_id = null;
    }
  }
};
</script>
