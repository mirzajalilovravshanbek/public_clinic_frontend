<template>
  <table class="pt-2">
    <tbody class="text-center" v-for="(item, index) in data.data" :key="index">
      <tr>
        <th>Олтиариқ Тиббиёт Бирлашмаси</th>
      </tr>
      <tr>
        <th>Бемор Ф.И.Ш</th>
      </tr>
      <tr>
        <td>{{ item.registration.patient.full_name }}</td>
      </tr>
      <hr />
      <tr>
        <th>Шифокор Ф.И.Ш</th>
      </tr>
      <tr>
        <td>{{ item.room.doctor.full_name }}</td>
      </tr>
      <hr />
      <tr>
        <th>Хона Рақами</th>
      </tr>
      <tr>
        <td>{{ item.room.full_name }}</td>
      </tr>
      <hr />
      <tr>
        <th>Келган Вақти</th>
      </tr>
      <tr>
        <td>{{ item.registration.created_at | moment }}</td>
      </tr>
      <hr />
      <tr>
        <th>Навбат Рақами</th>
      </tr>
      <tr>
        <td>
          <h2 class="m-0 p-0">{{ item.turn }}</h2>
        </td>
      </tr>
      <hr />
      <tr>
        <th>Сизга Соғлик Тилаймиз!</th>
      </tr>
      <b
        >****************************************************************************</b
      >
    </tbody>
  </table>
</template>
<script>
import moment from "moment";
export default {
  data: () => ({
    data: []
  }),
  mounted() {
    let self = this;
    self.data = self.$cookies.get("printData");
    window.print();
    self.$cookies.remove("printData");
    setTimeout(() => {
      window.close();
    }, 3000);
  },
  filters: {
    moment: function(date) {
      return moment.unix(date).format("DD.MM.YYYY HH:mm:ss");
    }
  }
};
</script>
<style scoped>
td,
th {
  font-size: 19pt;
  color: #000;
  padding-bottom: 7px;
}
b {
  color: #000;
}
</style>
