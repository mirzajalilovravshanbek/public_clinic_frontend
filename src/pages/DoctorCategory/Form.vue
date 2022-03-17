<template>
  <b-container fluid>
    <md-card>
      <md-card-header data-background-color="green">
        <b-row>
          <b-col md="4" sm="4" lg="4" xl="4">
            <b-button
              :to="{ path: '/doctorcategory/index' }"
              size="md"
              variant="info"
              v-b-tooltip.hover.v-info
              title="Бош саҳифа"
            >
              <b-icon icon="house-door"></b-icon>
            </b-button>
          </b-col>
          <b-col md="4" sm="4" lg="4" xl="4" class="text-center">
            <h4 class="title">Бўлим қўшиш</h4>
          </b-col>
          <b-col md="4" sm="4" lg="4" xl="4"> </b-col>
        </b-row>
      </md-card-header>
      <md-card-content>
        <form>
          <b-row class="my-1">
            <b-col md="6" sm="6" lg="6" xl="6">
              <md-field>
                <b-icon icon="door-open-fill" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Бўлим номи<sup class="text-danger">*</sup></label>
                <md-input v-model="datas.name" md-dense></md-input>
              </md-field>
            </b-col>
            <b-col md="6" sm="6" lg="6" xl="6">
              <md-field>
                <b-icon icon="cash" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Нархи<sup class="text-danger">*</sup></label>
                <md-input v-model="datas.price" md-dense></md-input>
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
      name: null,
      price: null
    },
    sending: false
  }),
  async mounted() {
    let self = this;

    //update room => xonani tahrirlash
    if (self.$route.path != "/doctorcategory/create") {
      let id = self.$route.params.id;

      try {
        const response = await self.axios.get("api/doctor_category/id/" + id);
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
      if (self.$route.path == "/doctorcategory/create") {
        var methods = "post";
        var action = "api/doctor_category";
      } else {
        var methods = "patch";
        var action = "api/doctor_category/id/" + self.$route.params.id;
      }
      try {
        const response = await axios({
          method: methods,
          url: action,
          data: self.datas
        });
        self.sending = false;
        self.$router.push("/doctorcategory/index");
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    Cancel() {
      this.datas.name = null;
      this.datas.price = null;
    }
  }
};
</script>
