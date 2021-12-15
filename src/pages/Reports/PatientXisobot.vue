<template>
  <b-container fluid class="all-div-height">
    <b-row>
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
      <b-col md="4" sm="4" lg="4" xl="4">
        <v-select
          :clearable="true"
          :options="patients"
          v-model="datas.patient_id"
          placeholder="Беморни танланг..."
          :reduce="full_name => full_name.id"
          label="full_name"
        />
      </b-col>
      <b-col md="2" sm="2" lg="2" xl="2">
        <b-button
          style="color: #ffffff;"
          variant="info"
          @click="View()"
          :disabled="rmk_sending"
          block
        >
          <b-spinner small v-if="rmk_sending"></b-spinner>
          Кўриш
        </b-button>
      </b-col>
    </b-row>
    <b-row class="justify-content-md-center" v-if="show_table">
      <b-col lg="12" md="12" xl="12">
        <md-card>
          <table class="table table-bordered table-hover table-sm text-center">
            <thead>
              <tr class="table-primary">
                <th>#</th>
                <th>Бемор</th>
                <th>Бош Қолдиқ</th>
                <th>Қарзи</th>
                <th>Кирим</th>
                <th>Чиқим</th>
                <th>Якуний Қолдиқ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in patient_kassa" :key="index">
                <th>{{ index + 1 }}</th>
                <td @click="Click(item.patient.id)">
                  <router-link
                    :to="{ path: '/reports/patient/' + item.patient.id }"
                    >{{
                      item.patient != null ? item.patient.full_name : ""
                    }}</router-link
                  >
                </td>
                <td>
                  {{ Number(item.begin_balance).toLocaleString("ru-RU") }}
                </td>
                <td>{{ Number(item.price_must).toLocaleString("ru-RU") }}</td>
                <td>{{ Number(item.payment).toLocaleString("ru-RU") }}</td>
                <td>{{ Number(item.backlog).toLocaleString("ru-RU") }}</td>
                <td>{{ Number(item.end_balance).toLocaleString("ru-RU") }}</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <th colspan="2">Жами</th>
                <th>{{ Number(begin_balance_sum).toLocaleString("ru-RU") }}</th>
                <th>{{ Number(price_must_sum).toLocaleString("ru-RU") }}</th>
                <th>{{ Number(payment_sum).toLocaleString("ru-RU") }}</th>
                <th>{{ Number(backlog_sum).toLocaleString("ru-RU") }}</th>
                <th>{{ Number(end_balance_sum).toLocaleString("ru-RU") }}</th>
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

export default {
  components: { DatePicker },
  data() {
    return {
      datas: {
        start: null,
        end: null,
        patient_id: null
      },
      lang: {
        formatLocale: {
          firstDayOfWeek: 1
        },
        monthBeforeYear: false
      },
      patients: [],
      filter: "",
      rmk_sending: false,
      patient_kassa: [],
      show_table: false,
      begin_balance_sum: 0,
      price_must_sum: 0,
      payment_sum: 0,
      backlog_sum: 0,
      end_balance_sum: 0
    };
  },
  mounted() {
    let self = this;
    axios.get("patient/get_patient_list").then(function(response) {
      self.patients = response.data.data;
    });
  },
  methods: {
    View() {
      let self = this;
      self.rmk_sending = true;
      axios({
        method: "post",
        url: "report/patient_report",
        data: self.datas
      }).then(function(response) {
        if (response.data.status == true) {
          self.rmk_sending = false;
          self.patient_kassa = response.data.data;
          self.Summa();
          self.show_table = true;
        }
      });
    },
    Summa() {
      let self = this;
      self.begin_balance_sum = 0;
      self.price_must_sum = 0;
      self.payment_sum = 0;
      self.backlog_sum = 0;
      self.end_balance_sum = 0;

      self.patient_kassa.forEach(function(key, value) {
        self.begin_balance_sum += parseFloat(key.begin_balance);
        self.price_must_sum += parseFloat(key.price_must);
        self.payment_sum += parseFloat(key.payment);
        self.backlog_sum += parseFloat(key.backlog);
        self.end_balance_sum += parseFloat(key.end_balance);
      });
    },
    Click(id) {
      localStorage.setItem("end", this.datas.end);
      localStorage.setItem("start", this.datas.start);
      localStorage.setItem("patient_id", id);
    }
  }
};
</script>
