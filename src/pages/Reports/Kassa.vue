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
      <b-col md="4" sm="4" lg="4" xl="4">
        <v-select
          :clearable="true"
          :options="paytype"
          placeholder="Тўлов турини танланг..."
          v-model="datas.pay_type"
          :reduce="full_name => full_name.id"
          label="full_name"
        />
      </b-col>
      <b-col md="1" sm="1" lg="1" xl="1">
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
    </b-row>
    <b-row class="justify-content-md-center" v-if="showtable">
      <b-col md="12" lg="12" xl="12">
        <md-card>
          <table class="table table-bordered table-hover table-sm text-center">
            <thead>
              <tr>
                <th colspan="5">Касса Китоби {{ type_pay_name }}</th>
              </tr>
              <tr>
                <th>№</th>
                <th>Операция</th>
                <th>Кирим</th>
                <th>Чиқим</th>
              </tr>
              <tr>
                <th colspan="2">Кун Бошига Қолдиқ</th>
                <th colspan="2">{{ first_summ * 1 }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in kassa_table" :key="index">
                <th>{{ index + 1 }}</th>
                <td>
                  {{ parseFloat(item.price) > 0 ? "Кирим" : "Чиқим" }}
                  №{{ item.id }}
                  {{ item.created_at | moment }}
                </td>
                <td>
                  <span v-if="item.price > 0">{{
                    Number(item.price).toLocaleString("ru-RU")
                  }}</span>
                  <span v-else>x</span>
                </td>
                <td>
                  <span v-if="item.price < 0">{{
                    Number(item.price).toLocaleString("ru-RU")
                  }}</span>
                  <span v-else>x</span>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <th colspan="2">Жами Сумма</th>
                <th>{{ pay_in }}</th>
                <th>{{ pay_out }}</th>
              </tr>
              <tr>
                <th colspan="2">Охирги Қолдиқ Сумма</th>
                <th colspan="2">{{ last_remain }}</th>
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
        pay_type: null
      },
      lang: {
        formatLocale: {
          firstDayOfWeek: 1
        },
        monthBeforeYear: false
      },
      AllErrors: "",
      paytype: [],
      kassa_table: [],
      first_summ: null,
      pay_in: 0,
      pay_out: 0,
      last_remain: 0,
      type_pay_name: "",
      sending: false,
      showtable: false
    };
  },
  mounted() {
    let self = this;
   
    //get list types of pay => to'lov turlarini olish
    axios({
      url: "universal/get_pay_type",
      method: "get"
    }).then(function(response) {
      self.paytype = response.data.data;
    });
  },
  methods: {
    Send() {
      let self = this;
      
      axios({
        method: "post",
        url: "report/cash_sverka",
        data: self.datas
      })
      .then(function(response) {
        //console.log(response.data.data);
        self.type_pay_name = response.data.data.full_data[0]
          ? response.data.data.full_data[0].pay_type.full_name
          : "";
        self.kassa_table = response.data.data.full_data;
        self.first_summ = response.data.data.full_summa[0].begin_summa;
        self.Summa();
        self.sending = false;
        self.showtable = true;
      });
    },
    Summa() {
      let self = this;
      self.pay_in = 0;
      self.pay_out = 0;
      self.kassa_table.forEach(function(key, value) {
        self.pay_in += parseFloat(key.price) > 0 ? parseFloat(key.price) : 0;
        self.pay_out += parseFloat(key.price) < 0 ? parseFloat(key.price) : 0;
      });
      self.last_remain =
        self.pay_in + self.pay_out + parseFloat(self.first_summ * 1);
    }
  },
  filters: {
    moment: function(date) {
      return moment.unix(date).format("DD.MM.YYYY HH:mm:ss");
    }
  }
};
</script>
