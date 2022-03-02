<template>
  <b-container fluid="lg">
    <md-card>
      <md-card-header data-background-color="green">
        <b-row>
          <b-col md="4" sm="4" lg="4" xl="4">
            <b-button
              :to="{ path: '/pill/index' }"
              size="md"
              variant="info"
              v-b-tooltip.hover.v-info
              title="Бош саҳифа"
            >
              <b-icon icon="house-door"></b-icon>
            </b-button>
          </b-col>
          <b-col md="4" sm="4" lg="4" xl="4" class="text-center">
            <h4 class="title">Дори қўшиш</h4>
          </b-col>
          <b-col md="4" sm="4" lg="4" xl="4"> </b-col>
        </b-row>
      </md-card-header>
      <md-card-content>
        <form>
          <b-row class="my-1">
            <b-col md="12" sm="12" lg="12" xl="12">
              <md-field>
                <b-icon icon="circle-half" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Дори номи<sup class="text-danger">*</sup></label>
                <md-input v-model="datas.name" md-dense></md-input>
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
      name: null
    },
    sending: false
  }),
  async mounted() {
    let self = this;

    //update pill => dorini tahrirlash
    if (self.$route.path != "/pill/create") {
      let id = self.$route.params.id;

      try {
        const response = await self.axios.get("api/pill/id/" + id);
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
      if (self.$route.path == "/pill/create") {
        var methods = "post";
        var action = "api/pill";
      } else {
        var methods = "patch";
        var action = "api/pill/id/" + self.$route.params.id;
      }
      try {
        const response = await axios({
          method: methods,
          url: action,
          data: self.datas
        });
        self.sending = false;
        self.$router.push("/pill/index");
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    Cancel() {
      this.datas.name = null;
    }
  }
};
</script>
