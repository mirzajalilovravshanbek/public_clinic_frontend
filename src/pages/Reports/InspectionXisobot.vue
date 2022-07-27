<template>
  <b-container fluid class="all-div-height">
    <h5 class="text-center">Текширувлар Ҳисоботи</h5>
    <b-row class="justify-content-md-center">
      <b-col md="3" sm="3" lg="3" xl="3">
        <date-picker
          v-model="datas.date1"
          format="DD.MM.YYYY HH:mm:ss"
          value-type="X"
          type="datetime"
          :lang="lang"
          placeholder="Вақтдан..."
          style="width: 100%"
        ></date-picker>
      </b-col>
      <b-col md="3" sm="3" lg="3" xl="3">
        <date-picker
          v-model="datas.date2"
          format="DD.MM.YYYY HH:mm:ss"
          value-type="X"
          type="datetime"
          :lang="lang"
          placeholder="Вақтгача..."
          style="width: 100%"
        ></date-picker>
      </b-col>
      <b-col md="4" sm="4" lg="4" xl="4">
        <v-select
          :clearable="true"
          :options="branches"
          v-model="datas.branch_id"
          placeholder="Филиални танланг..."
          :reduce="name => name.id"
          label="name"
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
          <b-icon icon="eye-fill"></b-icon>
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
                <th>Текширув Номи</th>
                <th>Беморлар Сони</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in employee_kassa" :key="index">
                <th>{{ index + 1 }}</th>
                <td> {{ item.inspection.name }}</td>
                <td> {{ item.count }}</td>
              </tr>
              <tr>
                <th colspan="2" class="text-center">Жами</th>
                <th>{{all_count}}</th>
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
        date1: null,
        date2: null,
        branch_id: null
      },
      lang: {
        formatLocale: {
          firstDayOfWeek: 1
        },
        monthBeforeYear: false
      },
      branches: [],
      employee_sending: false,
      employee_kassa: [],
      show_table: false,
      all_count: 0,
    };
  },
  mounted() {
    let self = this;
    //get list of branches => filiallar ro'yhatinini olish
    axios({
      url: "api/branch",
      method: "get"
    }).then(function(response) {
      self.branches = response.data;
    });
  },
  methods: {
    View() {
      let self = this;
      self.employee_sending = true;
      axios({
        method: "post",
        url: "api/registration/report/inspection",
        data: self.datas
      }).then(function(response) {
        self.employee_sending = false;
        self.employee_kassa = response.data;
        self.Summa();
        self.show_table = true;
      });
    },
    Summa() {
      let self = this;
      self.all_count = 0;

      self.employee_kassa.forEach(function(key, value) {
        self.all_count += parseFloat(key.count);
      });
    }
  }
};
</script>
