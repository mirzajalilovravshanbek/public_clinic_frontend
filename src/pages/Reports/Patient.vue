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
          :options="patients"
          v-model="datas.patient_id"
          placeholder="Беморни танланг..."
          :reduce="full_name => full_name.id"
          label="full_name"
        />
      </b-col>
      <b-col md="auto" sm="auto" lg="auto" xl="auto">
        <b-button
          style="color: #ffffff;"
          variant="info"
          @click="Send()"
          :disabled="sending"
        >
          <b-spinner small v-if="sending"></b-spinner>
          Кўриш
        </b-button>
      </b-col>
      <b-col md="auto" sm="auto" lg="auto" xl="auto">
        <b-button
          style="color: #000;"
          variant="outline-danger"
          :to="{ path: '/reports/patientxisobot' }"
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
              <tr>
                <th colspan="6">Бемор Сверкаси</th>
              </tr>
              <tr>
                <th>№</th>
                <th>Бемор Ҳужжати</th>
                <th>Қарзи</th>
                <th>Кирим</th>
                <th>Чиқим</th>
                <th>Қолдиқ</th>
              </tr>
              <tr>
                <th colspan="2">Бошланғич Қолдиқ</th>
                <th colspan="4">
                  {{ Number(begin_balance).toLocaleString("ru-RU") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in patient_all_things" :key="index">
                <th>{{ index + 1 }}</th>
                <td>
                  Бемор Ҳужжати №{{ item.id }} {{ item.created_at | moment }}
                </td>
                <td>{{ Number(item.price_must).toLocaleString("ru-RU") }}</td>
                <td>{{ Number(item.payment).toLocaleString("ru-RU") }}</td>
                <td>{{ Number(item.backlog).toLocaleString("ru-RU") }}</td>
                <td>{{ AllSum(index) }}</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <th colspan="2">Жами Сумма</th>
                <th>{{ Number(price_must_qarzi).toLocaleString("ru-RU") }}</th>
                <th>{{ Number(payment_kirim).toLocaleString("ru-RU") }}</th>
                <th>{{ Number(backlog_chiqim).toLocaleString("ru-RU") }}</th>
                <th>{{ Number(oxirgi_qoldiq).toLocaleString("ru-RU") }}</th>
              </tr>
              <tr>
                <th colspan="2">Охирги Қолдиқ</th>
                <th colspan="4">
                  {{ Number(end_balance).toLocaleString("ru-RU") }}
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
        patient_id: 0
      },
      lang: {
        formatLocale: {
          firstDayOfWeek: 1
        },
        monthBeforeYear: false
      },
      patients: [],
      patient_all_things: [],
      first_summ: null,
      payment_kirim: 0,
      backlog_chiqim: 0,
      price_must_qarzi: 0,
      oxirgi_qoldiq: 0,
      sending: false,
      showtable: false,
      begin_balance: null,
      end_balance: null
    };
  },
  mounted() {
    let self = this;

    //bemorlar ro'yhatini olish
    axios.get("patient/get_patient_list").then(function(response) {
      self.patients = response.data.data;
    });

    if (localStorage.start) {
      self.datas.start = localStorage.start;
    }
    if (localStorage.end) {
      self.datas.end = localStorage.end;
    }
    if (localStorage.patient_id) {
      self.datas.patient_id = parseInt(localStorage.patient_id);
    }
  },
  methods: {
    persist() {
      localStorage.start = this.start;
      localStorage.end = this.end;
      localStorage.patient_id = this.patient_id;
    },
    Send() {
      let self = this;

      axios({
        method: "post",
        url: "report/patient_sverka",
        data: self.datas
      }).then(function(response) {
        self.patient_all_things = response.data.data.full_data;
        self.begin_balance =
          response.data.data.start_data != null
            ? response.data.data.start_data.begin_balance
            : "";
        self.end_balance =
          response.data.data.start_data != null
            ? response.data.data.start_data.end_balance
            : "";
        self.Summa();
        self.sending = false;
        self.showtable = true;
      });
    },
    AllSum(index) {
      let self = this;
      let items = self.patient_all_things[index];
      items.summ =
        parseFloat(items.payment) +
        parseFloat(items.backlog) +
        parseFloat(items.discount) -
        parseFloat(items.price_must);
      return items.summ;
    },
    Summa() {
      let self = this;
      self.payment_kirim = 0;
      self.backlog_chiqim = 0;
      self.price_must_qarzi = 0;
      self.oxirgi_qoldiq = 0;
      self.patient_all_things.forEach(function(key, value) {
        self.payment_kirim += parseFloat(key.payment);
        self.backlog_chiqim += parseFloat(key.backlog);
        self.price_must_qarzi += parseFloat(key.price_must);
        self.oxirgi_qoldiq +=
          parseFloat(key.payment) +
          parseFloat(key.backlog) +
          parseFloat(key.discount) -
          parseFloat(key.price_must);
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
