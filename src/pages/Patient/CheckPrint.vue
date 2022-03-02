<template>
  <table class="pt-2">
    <tbody class="text-center" v-for="(item, index) in data" :key="index">
      <tr>
        <th>Олтиариқ Тиббиёт Бирлашмаси</th>
      </tr>
      <tr>
        <th>{{ item.branch != null ? item.branch.name : "" }}</th>
      </tr>
      <tr>
        <th>Бемор Ф.И.Ш</th>
      </tr>
      <tr>
        <td>{{ item.patient != null ? item.patient.fullname : "" }}</td>
      </tr>
      <hr />
      <tr>
        <th>Шифокор Ф.И.Ш</th>
      </tr>
      <tr>
        <td>{{ item.room.user != null ? item.room.user.username : "" }}</td>
      </tr>
      <hr />
      <tr>
        <th>Хона Рақами</th>
      </tr>
      <tr>
        <td>{{ item.room != null ? item.room.name : "" }}</td>
      </tr>
      <hr />
      <tr>
        <th>Келган Вақти</th>
      </tr>
      <tr>
        <td>{{ item.datetime | moment }}</td>
      </tr>
      <hr />
      <tr>
        <th>Навбат Рақами</th>
      </tr>
      <tr>
        <td>
          <h2 class="m-0 p-0">{{ item.number }}</h2>
        </td>
      </tr>
      <hr />
      <tr>
        <th>Сизга Соғлик Тилаймиз!</th>
      </tr>
      <tr>
        <th>*************************************</th>
      </tr>
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
    self.data = JSON.parse(localStorage.getItem("printData"));
    window.print();
    localStorage.removeItem("printData");
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
