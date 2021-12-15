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
          :options="employees"
          v-model="datas.doctor_id"
          placeholder="Ҳодимни танланг..."
          :reduce="full_name => full_name.id"
          label="full_name"
        />
      </b-col>
      <b-col md="2" sm="2" lg="2" xl="2">
        <b-button
          style="color: #ffffff;"
          variant="info"
          @click="View()"
          :disabled="employee_sending"
          block
        >
          <b-spinner small v-if="employee_sending"></b-spinner>
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
                <th rowspan="2" style="vertical-align: middle;">#</th>
                <th rowspan="2" style="vertical-align: middle;">Ҳодим</th>
                <th colspan="2">Бош Қолдиқ</th>
                <th colspan="2">Айланма</th>
                <th colspan="2">Якуний Қолдиқ</th>
              </tr>
              <tr class="table-primary">
                <th>Қарзи</th>
                <th>Ҳаққи</th>
                <th>Қарзи</th>
                <th>Берди</th>
                <th>Қарзи</th>
                <th>Ҳаққи</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in employee_kassa" :key="index">
                <th>{{ index + 1 }}</th>
                <td @click="Click(item.doctor_id)">
                  <router-link
                    :to="{ path: '/reports/employees/' + item.doctor_id }"
                    >{{ item.doctor.full_name }}</router-link
                  >
                </td>
                <td>{{ Number(item.begin_qarz).toLocaleString("ru-RU") }}</td>
                <td>{{ Number(item.begin_tolov).toLocaleString("ru-RU") }}</td>
                <td>{{ Number(item.aylanma_qarz).toLocaleString("ru-RU") }}</td>
                <td>
                  {{ Number(item.aylanma_tolov).toLocaleString("ru-RU") }}
                </td>
                <td>{{ Number(item.end_qarz).toLocaleString("ru-RU") }}</td>
                <td>{{ Number(item.end_tolov).toLocaleString("ru-RU") }}</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <th colspan="2">Жами</th>
                <th>{{ Number(begin_qarz_sum).toLocaleString("ru-RU") }}</th>
                <th>{{ Number(begin_tolov_sum).toLocaleString("ru-RU") }}</th>
                <th>{{ Number(aylanma_qarz_sum).toLocaleString("ru-RU") }}</th>
                <th>{{ Number(aylanma_tolov_sum).toLocaleString("ru-RU") }}</th>
                <th>{{ Number(end_qarz_sum).toLocaleString("ru-RU") }}</th>
                <th>{{ Number(end_tolov_sum).toLocaleString("ru-RU") }}</th>
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
        doctor_id: null
      },
      lang: {
        formatLocale: {
          firstDayOfWeek: 1
        },
        monthBeforeYear: false
      },
      employees: [],
      employee_sending: false,
      employee_kassa: [],
      show_table: false,
      begin_qarz_sum: 0,
      begin_tolov_sum: 0,
      aylanma_qarz_sum: 0,
      aylanma_tolov_sum: 0,
      end_qarz_sum: 0,
      end_tolov_sum: 0
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
  },
  methods: {
    View() {
      let self = this;
      self.employee_sending = true;
      axios({
        method: "post",
        url: "report/doctor_report",
        data: self.datas
      }).then(function(response) {
        // console.log(response.data)
        self.employee_sending = false;
        self.employee_kassa = response.data.data;
        self.Summa();
        self.show_table = true;
      });
    },
    Click(id) {
      localStorage.setItem("end", this.datas.end);
      localStorage.setItem("start", this.datas.start);
      localStorage.setItem("doctor_id", id);
    },
    Summa() {
      let self = this;
      self.begin_qarz_sum = 0;
      self.begin_tolov_sum = 0;
      self.aylanma_qarz_sum = 0;
      self.aylanma_tolov_sum = 0;
      self.end_qarz_sum = 0;
      self.end_tolov_sum = 0;

      self.employee_kassa.forEach(function(key, value) {
        self.begin_qarz_sum += parseFloat(key.begin_qarz);
        self.begin_tolov_sum += parseFloat(key.begin_tolov);
        self.aylanma_qarz_sum += parseFloat(key.aylanma_qarz);
        self.aylanma_tolov_sum += parseFloat(key.aylanma_tolov);
        self.end_qarz_sum += parseFloat(key.end_qarz);
        self.end_tolov_sum += parseFloat(key.end_tolov);
      });
    }
  }
};
</script>
