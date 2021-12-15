<template>
  <b-container fluid="xl" class="div-body">
    <b-row>
      <b-col sm="12" md="6" lg="6" xl="6">
        <table class="table table-bordered table-sm text-center">
          <thead>
            <tr class="table-primary">
              <th>#</th>
              <th>Шифокор</th>
              <th>Шифокор Ихтисослиги</th>
              <th>Хона Рақами</th>
              <th>Навбат Рақами</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in queue" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ item.room.doctor.full_name }}</td>
              <td>{{ item.room.doctor.position.full_name }}</td>
              <td>{{ item.room.full_name }}</td>
              <td>{{ item.turn }}</td>
            </tr>
          </tbody>
        </table>
      </b-col>
      <b-col sm="12" md="6" lg="6" xl="6">
        <table class="table table-bordered table-sm text-center">
          <thead>
            <tr class="table-primary">
              <th>#</th>
              <th>Шифокор</th>
              <th>Шифокор Ихтисослиги</th>
              <th>Хона Рақами</th>
              <th>Навбат Рақами</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>Soliyev Xurshidbek</td>
              <td>Терапевт</td>
              <td>12-хона</td>
              <td>18</td>
            </tr>
            <tr>
              <th>2</th>
              <td>Soliyev Xurshidbek</td>
              <td>Терапевт</td>
              <td>12-хона</td>
              <td>18</td>
            </tr>
            <tr>
              <th>3</th>
              <td>Soliyev Xurshidbek</td>
              <td>Терапевт</td>
              <td>12-хона</td>
              <td>18</td>
            </tr>
            <tr>
              <th>4</th>
              <td>Soliyev Xurshidbek</td>
              <td>Терапевт</td>
              <td>12-хона</td>
              <td>18</td>
            </tr>
            <tr>
              <th>5</th>
              <td>Soliyev Xurshidbek</td>
              <td>Терапевт</td>
              <td>12-хона</td>
              <td>18</td>
            </tr>
            <tr>
              <th>6</th>
              <td>Soliyev Xurshidbek</td>
              <td>Терапевт</td>
              <td>12-хона</td>
              <td>18</td>
            </tr>
            <tr>
              <th>7</th>
              <td>Soliyev Xurshidbek</td>
              <td>Терапевт</td>
              <td>12-хона</td>
              <td>18</td>
            </tr>
            <tr>
              <th>8</th>
              <td>Soliyev Xurshidbek</td>
              <td>Терапевт</td>
              <td>12-хона</td>
              <td>18</td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      queue: []
    };
  },
  mounted() {
    let self = this;
    //get list of followers => navbatlar ro'yhatini olish
    axios({
      url: "universal/queue_table_list",
      method: "get",
      params: {
        id: localStorage.getItem("branch_id")
      }
    }).then(function(response) {
      self.queue = response.data.data;
    });
  }
};
</script>
<style scoped>
.div-body {
  height: 548px !important;
}
</style>
