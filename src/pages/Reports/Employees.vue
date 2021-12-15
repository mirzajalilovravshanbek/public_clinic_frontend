<template>
  <b-container fluid class="all-div-height">
    <b-row class="text-center">
      <b-col md="3" sm="3" lg="3" xl="3">
        <date-picker
          v-model="datas.start"
          format="DD.MM.YYYY HH:mm:ss"
          value-type="X"
          type="datetime"
          :lang="lang"
          placeholder="Вақтдан..."
        ></date-picker>
      </b-col>
      <b-col md="3" sm="3" lg="3" xl="3">
        <date-picker
          v-model="datas.end"
          format="DD.MM.YYYY HH:mm:ss"
          value-type="X"
          type="datetime"
          :lang="lang"
          placeholder="Вақтгача..."
        ></date-picker>
      </b-col>
      <b-col md="3" sm="3" lg="3" xl="3">
        <v-select
          :clearable="true"
          :options="employees"
          v-model="datas.doctor_id"
          placeholder="Ҳодимни танланг..."
          :reduce="full_name => full_name.id"
          label="full_name"
        />
      </b-col>
      <b-col md="1" sm="1" lg="1" xl="1">
        <b-button
          style="color: #ffffff;"
          variant="info"
          @click="Send()"
          :disabled="xodim_sending"
        >
          <b-spinner small v-if="xodim_sending"></b-spinner>
          Кўриш
        </b-button>
      </b-col>
      <b-col md="2" sm="2" lg="2" xl="2">
        <b-button
          style="color: #000;"
          variant="outline-danger"
          :to="{ path: '/reports/employeesxisobot' }"
        >
          Орқага
        </b-button>
      </b-col>
    </b-row>
    <b-row class="justify-content-md-center" v-if="showtable">
      <b-col md="12" lg="12" xl="12">
        <md-card>
          <table class="table table-bordered table-hover table-sm text-center">
            <thead>
              <tr class="table-primary">
                <th rowspan="2" style="vertical-align: middle;">#</th>
                <th rowspan="2" style="vertical-align: middle;">Операция</th>
                <th colspan="2">{{ employees_full_name }}</th>
              </tr>
              <tr class="table-primary">
                <th>Ҳисобланди</th>
                <th>Тўланди</th>
              </tr>
              <tr>
                <th colspan="2">{{ datas.start | moment }} даги Қолдиқ</th>
                <th>
                  <span v-if="parseFloat(begin_summa) >= 0">{{
                    Number(begin_summa).toLocaleString("ru-RU")
                  }}</span>
                </th>
                <th>
                  <span v-if="parseFloat(begin_summa) < 0">{{
                    Number(begin_summa * -1).toLocaleString("ru-RU")
                  }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in employees_kassa" :key="index">
                <th>{{ index + 1 }}</th>
                <td>Ҳужжат №{{ item.id }} {{ item.created_at | moment }}</td>
                <td>
                  <span v-if="item.price >= 0">{{
                    Number(item.price).toLocaleString("ru-RU")
                  }}</span>
                </td>
                <td>
                  <span v-if="item.price < 0">{{
                    Number(item.price * -1).toLocaleString("ru-RU")
                  }}</span>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <th colspan="2">Жами</th>
                <th>{{ Number(calculated).toLocaleString("ru-RU") }}</th>
                <th>{{ Number(paid).toLocaleString("ru-RU") }}</th>
              </tr>
              <tr>
                <th colspan="2">Охирги Қолдиқ</th>
                <th>
                  <span v-if="end_summa > 0">{{
                    Number(end_summa).toLocaleString("ru-RU")
                  }}</span>
                </th>
                <th>
                  <span v-if="end_summa < 0">{{
                    Number(end_summa * -1).toLocaleString("ru-RU")
                  }}</span>
                </th>
              </tr>
            </tbody>
          </table>
        </md-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import moment from "moment";

export default {
  components: { DatePicker },
  data() {
    return {
      datas: {
        start: null,
        end: null,
        doctor_id: 0
      },
      lang: {
        formatLocale: {
          firstDayOfWeek: 1
        },
        monthBeforeYear: false
      },
      employees: [],
      employees_full_name: null,
      employees_kassa: [],
      xodim_sending: false,
      showtable: false,
      begin_summa: null,
      end_summa: null,
      calculated: 0,
      paid: 0
    };
  },
  mounted() {
    let self = this;

    //get list of employees => xodimlar ro'yhatinini olish
    axios({
      url: "universal/staff_list",
      method: "get",
      params: {
        id: localStorage.getItem("branch_id")
      }
    }).then(function(response) {
      self.employees = response.data.data;
    });

    if (localStorage.start) {
      self.datas.start = localStorage.start;
    }
    if (localStorage.end) {
      self.datas.end = localStorage.end;
    }
    if (localStorage.doctor_id) {
      self.datas.doctor_id = parseInt(localStorage.doctor_id);
    }
  },
  methods: {
    persist() {
      localStorage.start = this.start;
      localStorage.end = this.end;
      localStorage.doctor_id = this.doctor_id;
    },
    Send() {
      let self = this;

      axios({
        method: "post",
        url: "report/doctor_sverka",
        data: self.datas
      }).then(function(response) {
        self.employees_kassa = response.data.data.full_data;
        self.employees_full_name =
          response.data.data.full_summa != null
            ? response.data.data.full_summa[0].doctor.full_name
            : "";
        self.begin_summa =
          response.data.data.full_summa != null
            ? response.data.data.full_summa[0].begin_summa
            : 0;
        self.end_summa =
          response.data.data.full_summa != null
            ? response.data.data.full_summa[0].end_summa
            : 0;
        self.xodim_sending = false;
        self.Summa();
        self.showtable = true;
      });
    },
    Summa() {
      let self = this;
      self.calculated = 0;
      self.paid = 0;
      self.employees_kassa.forEach(function(key, value) {
        self.calculated +=
          parseFloat(key.price) > 0 ? parseFloat(key.price) : 0;
        self.paid +=
          parseFloat(key.price) < 0 ? parseFloat(key.price) : 0;
      });
    }
  },
  filters: {
    moment: function(date) {
      return moment.unix(date).format("DD.MM.YYYY HH:mm:ss");
    }
  }
};
</script>
