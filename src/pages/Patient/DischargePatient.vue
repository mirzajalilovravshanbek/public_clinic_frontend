<template>
  <div class="pl-5 pr-4 py-2">
    <table class="table table-borderless table-md myFormat">
      <tbody style="text-align: center">
        <tr>
          <th style="width: 30%">
            Ўзбекистон Республикаси Соғлиқни сақлаш вазирлиги Олтиариқ тумани
            Муассаса номи:&ensp;
            {{
              doctor_data.doctor != null ? doctor_data.doctor.branch.name : ""
            }}
          </th>
          <th style="width: 28%"></th>
          <th style="width: 32%">
            Ўзбекистон Республикаси Соғлиқни сақлаш вазирининг 2020 йил 31
            декабрдаги № 363-сонли буйруғи билан тасдиқланган &nbsp;___-рақамли
            тиббий хужжат шакли
          </th>
        </tr>
      </tbody>
    </table>

    <h3 style="text-align: center; font-weight: 700; font-color: black">
      № <u>{{ doctor_data.registration_id }}</u> {{ title }}
    </h3>

    <table class="table table-borderless table-md myFormat">
      <tbody>
        <tr>
          <th>ФИШ:</th>
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
          <th>Келган вақти:</th>
          <td>{{ created_at | moment }}</td>
          <th>Кетган вақти:</th>
          <td>{{ updated_at | moment }}</td>
        </tr>
        <tr>
          <th>Ташхис:</th>
          <td colspan="3">
            {{ doctor_data.diagnos }}
          </td>
        </tr>
        <tr>
          <th>Бемор шикояти:</th>
          <td colspan="3">{{ doctor_data.complaint }}</td>
        </tr>
        <tr>
          <th>Касаллик тарихи (Анамнез):</th>
          <td colspan="3">{{ doctor_data.medical_history }}</td>
        </tr>
        <tr>
          <th>Объектив кўрув:</th>
          <td colspan="3">{{ doctor_data.objective_vision }}</td>
        </tr>
        <tr>
          <th>Инструментал текшириш:</th>
          <td colspan="3">{{ doctor_data.instrumental }}</td>
        </tr>
        <tr>
          <th>Хамрох диагноз:</th>
          <td colspan="3">{{ doctor_data.concomitant }}</td>
        </tr>
        <tr>
          <th>Даволаш:</th>
          <td colspan="3">{{ doctor_data.procedure }}</td>
        </tr>
        <tr>
          <th>Тавсия:</th>
          <td colspan="3">{{ doctor_data.recommended }}</td>
        </tr>
      </tbody>
    </table>

    <table class="table table-bordered table-md myFormat">
      <tbody>
        <tr>
          <th style="width:2%">№</th>
          <th>Дори номи</th>
          <th>Кун</th>
          <th>Махал</th>
          <th>Қўшимчалар</th>
        </tr>
        <tr v-for="(item, index) in doctor_data.reciept" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.pill != null ? item.pill.name : "" }}</td>
          <td>{{ item.day }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.comment }}</td>
        </tr>
      </tbody>
    </table>

    <table class="table table-borderless table-md myFormat">
      <tbody>
        <tr>
          <th>Шифокор:</th>
          <th style="text-align:right">
            {{ doctor_data.doctor != null ? doctor_data.doctor.name : "" }}
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data: () => ({
    patient_data: [],
    doctor_data: [],
    title: "",
    created_at: null,
    updated_at: null
  }),
  mounted() {
    let self = this;
    self.patient_data = JSON.parse(localStorage.getItem("patient"));
    self.doctor_data = JSON.parse(localStorage.getItem("doctor"));
    self.title = JSON.parse(localStorage.getItem("title"));
    self.created_at = JSON.parse(localStorage.getItem("created_at"));
    self.updated_at = JSON.parse(localStorage.getItem("updated_at"));
    window.print();
    localStorage.removeItem("patient");
    localStorage.removeItem("doctor");
    localStorage.removeItem("title");
    localStorage.removeItem("created_at");
    localStorage.removeItem("updated_at");
    setTimeout(() => {
      window.close();
    }, 3000);
  },
  filters: {
    moment: function(date) {
      if (date != null) {
        return moment.unix(date).format("DD.MM.YYYY");
      } else {
        return "";
      }
    }
  }
};
</script>

<style>
table.myFormat tr th td {
  font-size: 14pt;
}
</style>
