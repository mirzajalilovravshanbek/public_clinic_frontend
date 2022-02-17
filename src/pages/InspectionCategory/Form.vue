<template>
  <b-container fluid="lg">
    <md-card>
      <md-card-header data-background-color="green">
        <b-row>
          <b-col md="4" sm="4" lg="4" xl="4">
            <b-button
              :to="{ path: '/inspectioncategory/index' }"
              size="md"
              variant="info"
              v-b-tooltip.hover.v-info
              title="Бош саҳифа"
            >
              <b-icon icon="house-door"></b-icon>
            </b-button>
          </b-col>
          <b-col md="4" sm="4" lg="4" xl="4" class="text-center">
            <h4 class="title">Текширув Бўлими Қўшиш</h4>
          </b-col>
          <b-col md="4" sm="4" lg="4" xl="4"> </b-col>
        </b-row>
      </md-card-header>
      <md-card-content>
        <form>
          <b-row class="my-1">
            <b-col md="6" sm="6" lg="6" xl="6">
              <md-field>
                <b-icon icon="journal-bookmark" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Номи</label>
                <md-input v-model="datas.name" md-dense></md-input>
              </md-field>
            </b-col>
            <b-col md="6" sm="6" lg="6" xl="6">
              <b-icon icon="card-list" font-scale="1.6"></b-icon>
              <md-icon></md-icon>
              <label>Филиал</label>
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
      branch_id: null
    },
    branches: [],
    sending: false
  }),
  async mounted() {
    let self = this;

    //filiallar ro'yhati
    try {
      const response = await self.axios.get("api/branch");
      self.branches = response.data;
    } catch (error) {
      self.$store.state.errors = error;
    }

    //update room => xonani tahrirlash
    if (self.$route.path != "/inspectioncategory/create") {
      let id = self.$route.params.id;

      try {
        const response = await self.axios.get(
          "api/inspection_category/id/" + id
        );
        self.datas = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    }
  },
  methods: {
    async Save() {
      let self = this;
      self.sending = true;
      if (self.$route.path == "/inspectioncategory/create") {
        var methods = "post";
        var action = "api/inspection_category";
      } else {
        var methods = "patch";
        var action = "api/inspection_category/id/" + self.$route.params.id;
      }
      try {
        const response = await axios({
          method: methods,
          url: action,
          data: self.datas
        });
        self.sending = false;
        self.$router.push("/inspectioncategory/index");
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    Cancel() {
      this.datas.name = null;
      this.datas.branch_id = null;
    }
  }
};
</script>
