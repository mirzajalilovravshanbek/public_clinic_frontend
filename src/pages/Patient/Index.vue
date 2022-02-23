<template>
  <b-container fluid="sm" class="all-div-height">
    <!-- button panel start -->
    <b-row>
      <b-col
        sm="2"
        md="2"
        lg="2"
        xl="2"
        v-if="
          role === $store.state.REGISTRATION ||
            role === $store.state.DOCTOR ||
            role === $store.state.ITMED
        "
      >
        <b-button
          variant="success"
          block
          class="m-2"
          target="_blank"
          :to="{ path: '/patient/create' }"
          style="color: #fff;"
        >
          <b-icon icon="person-plus"></b-icon>
          Қўшиш</b-button
        >
      </b-col>
      <b-col sm="2" md="2" lg="2" xl="2">
        <b-button
          variant="primary"
          block
          class="m-2"
          target="_blank"
          @click="Data()"
        >
          <b-icon icon="arrow-clockwise"></b-icon>
          Янгилаш</b-button
        >
      </b-col>
      <b-col
        sm="2"
        md="2"
        lg="2"
        xl="2"
        v-if="
          role === $store.state.KASSA ||
            role === $store.state.LABARATORY ||
            role === $store.state.UZI
        "
      >
      </b-col>
      <b-col sm="8" md="8" lg="8" xl="8">
        <b-form-group
          label-for="filter-input"
          label-cols-sm="0"
          label-align-sm="right"
          label-size="sm"
          class="m-2"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Қидирув"
            ></b-form-input>

            <b-input-group-append>
              <b-button
                :disabled="!filter"
                @click="filter = ''"
                variant="danger"
                >Тозалаш</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <!-- button panel end -->
    <!-- main panel start -->
    <md-card class="p-2 card-margin">
      <div class="div-body">
        <b-table
          striped
          hover
          :items="filteredData"
          :fields="fields"
          :filter="filter"
          :current-page="currentPage"
          :per-page="perPage"
          bordered
          small
          style="cursor:pointer;"
          @filtered="onFiltered"
          @row-clicked="UpdatePatient"
          :tbody-tr-class="rowClass"
        >
          <template #cell(index)="row">
            <strong>{{ row.index + 1 }}</strong>
          </template>
          <template #cell(items)="row">
            {{ row.value.created_at }}
            {{ row.value.patient != null ? row.value.patient.fullname : "" }}
            {{ row.value.user != null ? row.value.user.username : "" }}
          </template>
          <template #cell(actions)="row">
            <b-button
              variant="outline-primary"
              target="_blank"
              size="sm"
              style="color: #1E90FF"
              :to="{ path: '/patient/update/' + row.item.id }"
              v-b-tooltip.hover.top.v-primary
              title="Таҳрирлаш"
            >
              <b-icon icon="Pencil" font-scale="0.9"></b-icon>
            </b-button>
          </template>
        </b-table>
      </div>
      <b-col sm="5" md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          size="md"
          class="my-0"
        ></b-pagination>
      </b-col>
    </md-card>
    <!-- main panel end -->
  </b-container>
</template>
<script>
import moment from "moment";
export default {
  name: "patient-index",
  data: () => ({
    role: null,
    users: [],
    filter: null,
    totalRows: 1,
    currentPage: 1,
    perPage: 20,
    fields: [
      {
        key: "index",
        label: "#",
        sortable: false
      },
      {
        key: "created_at",
        label: "Келган Вақти",
        formatter: (value, key, item) => {
          return moment.unix(value).format("DD.MM.YYYY HH:mm:ss");
        }
      },
      {
        key: "patient.fullname",
        label: "Бемор",
        sortable: true
      },
      {
        key: "user.username",
        label: "Рўйҳатга олган ходим",
        sortable: true
      },
      {
        key: "actions",
        label: ""
      }
    ]
  }),
  async mounted() {
    this.role = localStorage.getItem("role");
    await this.Data();
  },
  methods: {
    async Data() {
      let self = this;
      //get list of documents => hujjatlarni olish
      if(this.role == this.$store.state.REGISTRATION){
        var urlx = "api/registration/branch/"+localStorage.getItem("branch_id");
      } else if (this.role == this.$store.state.DOCTOR) {
        var urlx = "api/registration/doctor/"+localStorage.getItem("oid");        
      } else {
        var urlx = "api/registration/inspection/"+localStorage.getItem("oid");        
      }
      try {
        const response = await self.axios.get(urlx);
        self.users = response.data;
        self.totalRows = self.users.length;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    UpdatePatient(item) {
      let self = this;
      const route = self.$router.resolve({
        path: "/patient/update/" + item.id
      });
      window.open(route.href, "_blank");
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
      this.users.count = filteredItems.length;
    },
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.status === this.$store.state.WAITING) return "table-success";
    }
  },
  computed: {
    filteredData() {
      // let self = this;
      // if (
      //   self.$cookies.get("user").position === self.$store.state.DOCTOR ||
      //   self.$cookies.get("user").position === self.$store.state.UZI ||
      //   self.$cookies.get("user").position === self.$store.state.LABARATORY
      // ) {
      //   return this.users.filter(users => users.status === 1);
      // } else {
      //   return this.users;
      // }
      return this.users;
    }
  }
};
</script>
<style scoped>
.card-margin {
  margin: 0;
}
.div-body {
  height: 500px;
  overflow-y: auto;
}
</style>
