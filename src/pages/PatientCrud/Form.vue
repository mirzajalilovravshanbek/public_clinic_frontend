<template>
  <b-container fluid>
    <md-card>
      <md-card-header data-background-color="green">
        <b-row>
          <b-col md="4" sm="4" lg="4" xl="4">
            <b-button
              :to="{ path: '/patientcrud/index' }"
              size="md"
              variant="info"
              v-b-tooltip.hover.v-info
              title="Бош саҳифа"
            >
              <b-icon icon="house-door"></b-icon>
            </b-button>
          </b-col>
          <b-col md="4" sm="4" lg="4" xl="4" class="text-center">
            <h4 class="title">Бемор Қўшиш</h4>
          </b-col>
          <b-col md="4" sm="4" lg="4" xl="4"> </b-col>
        </b-row>
      </md-card-header>
      <md-card-content>
        <form>
          <b-row class="my-1">
            <!-- patient lastname input start -->
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="person" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Фамилия<sup class="text-danger">*</sup></label>
                <md-input v-model="datas.lastname" md-dense></md-input>
              </md-field>
            </b-col>
            <!-- patient lastname input start -->

            <!-- patient name input start -->
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="person" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Исми<sup class="text-danger">*</sup></label>
                <md-input v-model="datas.name" md-dense></md-input>
              </md-field>
            </b-col>
            <!-- patient name input start -->

            <!-- patient patronymic input start -->
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="person" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Отаси Исми<sup class="text-danger">*</sup></label>
                <md-input v-model="datas.patronymic" md-dense></md-input>
              </md-field>
            </b-col>
            <!-- patient patronymic input start -->
          </b-row>
          <b-row class="my-1">
            <!-- patient phone input start -->
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="phone" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Телефон</label>
                <md-input
                  v-model="datas.phone"
                  placeholder="+998"
                  md-dense
                ></md-input>
              </md-field>
            </b-col>
            <!-- patient phone input start -->

            <!-- patient birthday input start -->
            <b-col md="4" sm="4" lg="4" xl="4">
              <b-icon icon="calendar4-event" font-scale="1.2"></b-icon>
              <md-icon></md-icon>
              <label for="input-date">Туғилган сана</label><br />
              <date-picker
                id="input-date"
                v-model="datas.birthday"
                format="DD.MM.YYYY"
                value-type="X"
                style="width: 100%"
                type="date"
                :lang="lang"
                placeholder="Туғилган санани танланг..."
              ></date-picker>
            </b-col>
            <!-- patient birthday input start -->

            <!-- patient passport input start -->
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="file-ppt" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Паспорт</label>
                <md-input v-model="datas.passport" md-dense></md-input>
              </md-field>
            </b-col>
            <!-- patient passport input start -->
          </b-row>
          <b-row class="my-1">
            <!-- patient region input start -->
            <b-col md="4" sm="4" lg="4" xl="4">
              <b-icon icon="geo-alt" font-scale="1.6"></b-icon>
              <md-icon></md-icon>
              <label>Вилоят</label>
              <v-select
                :clearable="true"
                :options="regions"
                v-model="datas.region_id"
                :reduce="name => name.id"
                label="name"
                placeholder="Вилоятни танланг..."
                @input="GetDistrics()"
              >
              </v-select>
            </b-col>
            <!-- patient region input end -->

            <!-- patient district input start -->
            <b-col md="4" sm="4" lg="4" xl="4">
              <b-icon icon="geo-alt" font-scale="1.6"></b-icon>
              <md-icon></md-icon>
              <label>Туман</label>
              <v-select
                :clearable="true"
                :options="districts"
                v-model="datas.district_id"
                :reduce="name => name.id"
                label="name"
                placeholder="Туманни танланг..."
                @input="GetNeighboarhoods()"
              >
              </v-select>
            </b-col>
            <!-- patient district input end -->

            <!-- patient neighboarhood input start -->
            <b-col md="4" sm="4" lg="4" xl="4">
              <b-icon icon="geo-alt" font-scale="1.6"></b-icon>
              <md-icon></md-icon>
              <label>МФЙ</label>
              <v-select
                :clearable="true"
                :options="neighboarhoods"
                v-model="datas.neighboarhood_id"
                :reduce="name => name.id"
                label="name"
                placeholder="МФЙни танланг..."
              >
              </v-select>
            </b-col>
            <!-- patient neighboarhood input end -->
          </b-row>
          <b-row class="my-1">
            <!-- patient address input start -->
            <b-col md="4" sm="4" lg="4" xl="4">
              <md-field>
                <b-icon icon="house" font-scale="1.6"></b-icon>
                <md-icon></md-icon>
                <label>Манзил</label>
                <md-input v-model="datas.address" md-dense></md-input>
              </md-field>
            </b-col>
            <!-- patient address input end -->

            <!-- patient gender input start -->
            <b-col md="4" sm="4" lg="4" xl="4">
              <b-icon icon="person" font-scale="1.6"></b-icon>
              <md-icon></md-icon>
              <label>Жинси</label><br />
              <md-radio class="mx-1 my-0" v-model="datas.gender" value="male"
                >Эркак</md-radio
              >
              <md-radio class="mx-1 my-0" v-model="datas.gender" value="female"
                >Аёл</md-radio
              >
            </b-col>
            <!-- patient phone input end -->

            <!-- patient checkbox input start -->
            <b-col md="4" sm="4" lg="4" xl="4">
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6">
                  <b-form-checkbox
                    id="d-control"
                    name="d-control"
                    v-model="datas.d_control"
                    class="mt-4"
                  >
                    Д-назорат
                  </b-form-checkbox>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6">
                  <b-form-checkbox
                    id="disablity"
                    name="disablity"
                    v-model="datas.disability"
                    class="mt-4"
                  >
                    Ногиронлиги
                  </b-form-checkbox>
                </b-col>
              </b-row>
            </b-col>
            <!-- patient checkbox input end -->
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
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
export default {
  components: { DatePicker },
  data: () => ({
    datas: {
      fullname: null,
      lastname: null,
      name: null,
      patronymic: null,
      phone: null,
      birthday: null,
      gender: null,
      passport: null,
      address: null,
      region_id: null,
      district_id: null,
      neighboarhood_id: null,
      d_control: false,
      disability: false
    },
    lang: {
      formatLocale: {
        firstDayOfWeek: 1
      },
      monthBeforeYear: false
    },
    regions: [],
    districts: [],
    neighboarhoods: [],
    sending: false
  }),
  async mounted() {
    let self = this;

    await self.GetRegions();

    //update patient => bemorni tahrirlash
    if (self.$route.path != "/patientcrud/create") {
      let id = self.$route.params.id;

      try {
        const response = await self.axios.get("api/patient/id/" + id);
        self.datas = response.data;
        self.datas.birthday = response.data.birthday.toString();
        await self.GetDistrics();
        await self.GetNeighboarhoods();
      } catch (error) {}
    }
  },
  methods: {
    async GetRegions() {
      let self = this;

      //viloyatlar ro'yhati
      try {
        const response = await self.axios.get("api/region");
        self.regions = response.data;
      } catch (error) {}
    },
    async GetDistrics() {
      let self = this;

      //tumanlar ro'yhati
      if (self.datas.region_id != null) {
        try {
          const response = await self.axios.get(
            "api/district/region/" + self.datas.region_id
          );
          self.districts = response.data;
        } catch (error) {}
      }
    },
    async GetNeighboarhoods() {
      let self = this;
      //get list of neighboarhoods => mahallalar ro'yhatini olish
      if (self.datas.district_id != null) {
        try {
          const response = await self.axios.get(
            "api/neighboarhood/district/" + self.datas.district_id
          );
          self.neighboarhoods = response.data;
        } catch (error) {}
      }
    },
    async Save() {
      let self = this;
      self.sending = true;
      if (self.$route.path == "/patientcrud/create") {
        var methods = "post";
        var action = "api/patient";
      } else {
        var methods = "patch";
        var action = "api/patient/id/" + self.$route.params.id;
      }
      try {
        const response = await axios({
          method: methods,
          url: action,
          data: self.datas
        });
        self.$router.push("/patientcrud/index");
      } catch (error) {}
      self.sending = false;
    },
    Cancel() {
      this.datas.lastname = null;
      this.datas.name = null;
      this.datas.patronymic = null;
      this.datas.phone = null;
      this.datas.birthday = null;
      this.datas.gender = null;
      this.datas.passport = null;
      this.datas.address = null;
      this.datas.region_id = null;
      this.datas.district_id = null;
      this.datas.neighboarhood_id = null;
      this.datas.d_control = false;
      this.datas.disability = false;
    }
  }
};
</script>
