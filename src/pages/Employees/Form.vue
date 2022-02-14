<template>
  <b-container fluid="lg">
    <md-card>
      <!-- card header start -->
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
      <!-- card header end -->

      <!-- card content start -->
      <md-card-content>
        <form>
          <b-row class="my-1">
            <!-- username input start -->
            <b-col md="6" sm="6" lg="6" xl="6">
              <md-field>
                <b-icon icon="person" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>ФИШ</label>
                <md-input v-model="datas.username" md-dense></md-input>
              </md-field>
            </b-col>
            <!-- username input end -->

            <!-- password input start -->
            <b-col md="6" sm="6" lg="6" xl="6">
              <md-field>
                <b-icon icon="shield-lock" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Парол</label>
                <md-input v-model="datas.password" md-dense></md-input>
              </md-field>
            </b-col>
            <!-- password input end -->
          </b-row>
          <b-row class="my-1">
            <!-- branch input start -->
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
            <!-- branch input end -->

            <!-- room input start -->
            <b-col md="6" sm="6" lg="6" xl="6">
              <b-icon icon="door-open" font-scale="1.6"></b-icon>
              <label>Хона</label>
              <v-select
                :clearable="true"
                :options="rooms"
                v-model="datas.room_id"
                :reduce="name => name.id"
                label="name"
                placeholder="Хонани танланг..."
              >
              </v-select>
            </b-col>
            <!-- room input end -->
          </b-row>
          <b-row class="mt-3">
            <!-- role input start -->
            <b-col md="6" sm="6" lg="6" xl="6">
              <b-icon icon="bookmark-star" font-scale="1.6"></b-icon>
              <label>Ҳуқуқи</label>
              <v-select
                :clearable="true"
                :options="positions"
                v-model="datas.role"
                :reduce="label => label.name"
                label="label"
                placeholder="Ҳуқуқини танланг..."
              >
              </v-select>
            </b-col>
            <!-- role input end -->

            <!-- doctor input start -->
            <b-col md="6" sm="6" lg="6" xl="6" v-if="datas.role == 'Doctor'">
              <b-icon icon="person" font-scale="1.6"></b-icon>
              <label>Шифокор</label>
              <v-select
                :clearable="true"
                :options="doctors"
                v-model="datas.doctor_id"
                :reduce="name => name.id"
                label="name"
                placeholder="Шифокорни танланг..."
                @input="DisInspection()"
              >
              </v-select>
            </b-col>
            <!-- doctor input end -->

            <!-- inspection input start -->
            <b-col md="6" sm="6" lg="6" xl="6" v-if="datas.role == 'Inspector'">
              <b-icon icon="journal-medical" font-scale="1.6"></b-icon>
              <label>Текширув Бўлими</label>
              <v-select
                :clearable="true"
                :options="inspection_category"
                v-model="datas.inspection_category_id"
                :reduce="name => name.id"
                label="name"
                placeholder="Бўлимни танланг..."
                @input="DisDoctor()"
              >
              </v-select>
            </b-col>
            <!-- room input end -->

          </b-row>
          <b-row class="mt-3">
            <!-- type input start -->
            <b-col md="6" sm="6" lg="6" xl="6">
              <b-icon icon="cash" font-scale="1.6"></b-icon>
              <md-icon></md-icon>
              <label>Тўлов Тури</label>
              <v-select
                :clearable="true"
                :options="types"
                v-model="datas.type"
                :reduce="label => label.name"
                label="label"
                placeholder="Тўлов Турини танланг..."
              >
              </v-select>
            </b-col>
            <!-- type input end -->

            <!-- salary input start -->
            <b-col md="6" sm="6" lg="6" xl="6" v-if="datas.type == 'salary'">
              <md-field>
                <b-icon icon="cash" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Ойлик</label>
                <md-input v-model="datas.salary" md-dense></md-input>
              </md-field>
            </b-col>
            <!-- salary input end -->
          </b-row>
          <b-row class="mt-3">
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
      <!-- card content end -->
    </md-card>
  </b-container>
</template>
<script>
export default {
  data: () => ({
    datas: {
      username: null,
      role: null,
      doctor_id: null,
      inspection_category_id: null,
      room_id: null,
      password: null,
      type: null,
      salary: null,
      branch_id: null
    },
    positions: [
      {'name':'Register','label': 'Регистратор'},
      {'name':'Doctor','label': 'Шифокор'},
      {'name':'Inspector','label': 'Лаборант'}
    ],
    branches: [],
    doctors: [],
    inspection_category: [],
    rooms: [],
    types: [
      {'name':'percent','label': 'Фоиз'},
      {'name':'salary','label': 'Ойлик'}
    ], 
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

    //get list of doctors => shifokorlar ro'yhatini olish
    try {
      const response = await self.axios.get("api/doctor");
      self.doctors = response.data;
    } catch (error) {
      self.$store.state.errors = error;
    }

    //get list of inspections category => tekshiruv bo'limlari ro'yhatini olish
    try {
      const response = await self.axios.get("api/inspection_category");
      self.inspection_category = response.data;
    } catch (error) {
      self.$store.state.errors = error;
    }

    //get list of doctor_rooms => xonalar ro'yhatini olish
    try {
      const response = await self.axios.get("api/room");
      self.rooms = response.data;
    } catch (error) {
      self.$store.state.errors = error;
    }

    //update employees => xodimni tahrirlash
    if (self.$route.path != "/employees/create") {
      let id = self.$route.params.id;

      try {
        const response = await self.axios.get("api/user/id/"+id);
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
      if (self.$route.path == "/employees/create") {
        var methods = "post";
        var action = "api/user";
      } else {
        var methods = "patch";
        var action = "api/user/id/" + self.$route.params.id;
      }
      try {
        const response = await axios({
          method: methods,
          url: action,
          data: self.datas
        });
        self.sending = false;
        self.$router.push("/employees/index");
      } catch(error){
        self.$store.state.errors = error;
      }
    },
    Cancel() {
      this.datas.username = null;
      this.datas.role = null;
      this.datas.doctor_id = null;
      this.datas.inspection_category_id = null;
      this.datas.room_id = null;
      this.datas.password = null;
      this.datas.type = null;
      this.datas.salary = null;
      this.datas.branch_id = null;    
    },
    DisDoctor(){
      this.datas.doctor_id = null;
    },
    DisInspection(){
      this.datas.inspection_category_id = null;
    }
  }
};
</script>
