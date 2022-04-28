<template>
  <b-container fluid class="div-body">
    <h3 class="text-center my-1">{{ $t("Навбатлар Рўйҳати") }}</h3>
    <b-row>
      <b-col sm="12" md="6" lg="6" xl="6">
        <table class="table table-bordered table-sm text-center">
          <thead>
            <tr class="table-primary">
              <th>#</th>
              <th>{{ $t("Шифокор") }}</th>
              <th>{{ $t("Хона Рақами") }}</th>
              <th>{{ $t("Бемор") }}</th>
              <th>{{ $t("Навбат Рақами") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in firstTable" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ item.room != null ? item.room.user.username : "" }}</td>
              <td>{{ item.room != null ? item.room.name : "" }}</td>
              <td>{{ item.patient != null ? item.patient.fullname : "" }}</td>
              <th>{{ item.number }}</th>
            </tr>
          </tbody>
        </table>
      </b-col>
      <b-col sm="12" md="6" lg="6" xl="6">
        <table class="table table-bordered table-sm text-center">
          <thead>
            <tr class="table-primary">
              <th>#</th>
              <th>{{ $t("Шифокор") }}</th>
              <th>{{ $t("Хона Рақами") }}</th>
              <th>{{ $t("Бемор") }}</th>
              <th>{{ $t("Навбат Рақами") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in secondTable" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ item.room != null ? item.room.user.username : "" }}</td>
              <td>{{ item.room != null ? item.room.name : "" }}</td>
              <td>{{ item.patient != null ? item.patient.fullname : "" }}</td>
              <th>{{ item.number }}</th>
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
      queue: [],
      queuepolling: null,
      avarage_value: null
    };
  },
  async created() {
    await this.pollQueue();
  },
  beforeDestroy() {
    clearInterval(this.queuepolling);
  },
  async mounted() {
    await this.Data();
  },
  methods: {
    pollQueue() {
      let self = this;
      self.queuepolling = setInterval(async () => {
        await self.Data();
      }, 120000);
    },
    async Data() {
      let self = this;
      //get list of followers => navbatlar ro'yhatini olish
      try {
        const response = await self.axios({
          url:
            "api/registration/queue/branch/" +
            localStorage.getItem("branch_id"),
          method: "get"
        });
        self.queue = response.data;
        self.avarage_value = Math.ceil(self.queue.length / 2);
      } catch (error) {
        self.$store.state.errors = error;
      }
    }
  },
  computed: {
    firstTable() {
      let self = this;
      return self.queue.slice(0, parseInt(self.avarage_value));
    },
    secondTable() {
      let self = this;
      return self.queue.slice(parseInt(self.avarage_value), self.queue.length);
    }
  }
};
</script>
<style scoped>
.div-body {
  height: 100vh;
  overflow-y: auto;
}
</style>
