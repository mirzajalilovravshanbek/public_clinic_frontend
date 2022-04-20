<template>
  <div class="pl-5 pr-4 py-2">
    <div v-for="(item, index) in inspection_data" :key="index" style="page-break-before: always">
  
      <table class="table table-borderless table-md myFormat">
        <tbody style="text-align: center">
          <tr>
            <th style="width: 30%">
              Ўзбекистон Республикаси Соғлиқни сақлаш вазирлиги Олтиариқ тумани
              Муассаса номи:&ensp; {{ branch != null ? branch.name : "" }}
            </th>
            <th style="width: 25%"></th>
            <th style="width: 35%">
              Ўзбекистон Республикаси Соғлиқни сақлаш вазирининг 2020 йил 31
              декабрдаги № 363-сонли буйруғи билан тасдиқланган &nbsp;___-рақамли тиббий
              хужжат шакли
            </th>
          </tr>
        </tbody>
      </table>

      <h3 style="text-align: center; font-weight: 700; font-color: black">
        № ____ {{ item.inspection != null ? item.inspection.name : item.name }}
      </h3>

      <table class="table table-borderless table-md myFormat">
        <tbody>
          <tr>
            <th>Ф.И.Ш.:</th>
            <td>{{ patient_data != null ? patient_data.fullname : "" }}</td>
            <th>Туғилган сана:</th>
            <td>{{ patient_data.birthday | moment }}</td>
          </tr>
          <tr>
            <th>Телефон:</th>
            <td>{{ patient_data.phone != null ? patient_data.phone : "" }}</td>
            <th>Паспорт серия:</th>
            <td>
              {{ patient_data.passport != null ? patient_data.passport : "" }}
            </td>
          </tr>
          <tr>
            <th colspan="2">Биомаҳсулот олинган сана:</th>
            <td colspan="2">{{ created_at | moment_time }}</td>
          </tr>
        </tbody>
      </table>
      
      <table class="table table-bordered table-md myFormat">
        <tbody>
          <tr>
            <th style="width: 2%; text-align: center">№</th>
            <th style="width: 25%; text-align: center">Кўрсаткич</th>
            <th style="width: 30%; text-align: center">Натижа</th>
            <th style="width: 25%; text-align: center">Расм</th>
            <th style="width: 18%; text-align: center">Норма (СИ бирлиги)</th>
          </tr>
          <tr v-for="(itm, indx) in item.child" :key="indx">
            <td>{{ indx + 1 }}</td>
            <td>{{ itm.name }}</td>
            <td>{{ itm.text }}</td>
            <td style="text-align: center">
              <span v-if="itm.file">
                <img
                  style="width: 300px"
                  :src="`${axios.defaults.baseURL}upload/` + itm.file"
                />
              </span>
            </td>
            <td>{{ itm.norm }}</td>
          </tr>
          <tr>
            <th colspan="2" style="text-align: center">Шифокор:</th>
            <th colspan="3" style="text-align: right">
              {{ item.inspection != null ? item.inspection.user.username : "" }}
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data: () => ({
    patient_data: [],
    inspection_data: [],
    branch: null,
    created_at: null
  }),
  mounted() {
    let self = this;
    self.patient_data = JSON.parse(localStorage.getItem("patient"));
    self.inspection_data = JSON.parse(localStorage.getItem("inspection"));
    self.branch = JSON.parse(localStorage.getItem("branch"));
    self.created_at = JSON.parse(localStorage.getItem("created_at"));
    window.print();
    localStorage.removeItem("patient");
    localStorage.removeItem("inspection");
    localStorage.removeItem("branch");
    localStorage.removeItem("created_at");
    setTimeout(() => {
      window.close();
    }, 3000);
  },
  filters: {
    moment: function (date) {
      if (date != null) {
        return moment.unix(date).format("DD.MM.YYYY");
      } else {
        return "";
      }
    },
    moment_time: function (date) {
      if (date != null) {
        return moment.unix(date).format("DD.MM.YYYY HH:mm");
      } else {
        return "";
      }
    },
  },
};
</script>

<style>
table.myFormat tr th td {
  font-size: 14pt;
}
</style>
