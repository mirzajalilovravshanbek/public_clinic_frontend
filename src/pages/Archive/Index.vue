<template>
  <b-container fluid class="all-div-height">
    <!-- button panel start -->
    <b-row>
      <b-col sm="2" md="2" lg="2" xl="2">
        <b-button
          variant="primary"
          block
          class="m-2"
          target="_blank"
          @click="Data()"
        >
          <b-icon icon="arrow-clockwise"></b-icon>
          {{ $t("Янгилаш") }}</b-button
        >
      </b-col>
      <b-col sm="2" md="2" lg="2" xl="2"> </b-col>
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
              :placeholder="$t('Қидирув')"
            ></b-form-input>

            <b-input-group-append>
              <b-button
                :disabled="!filter"
                @click="filter = ''"
                variant="danger"
                >{{ $t("Тозалаш") }}</b-button
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
        <div class="d-flex justify-content-center mb-3" v-if="checkTable">
          <b-spinner
            variant="info"
            style="width: 3rem; height: 3rem;"
            type="grow"
            label="Spinning"
          ></b-spinner>
        </div>
        <b-table
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
              size="sm"
              style="color: #1E90FF"
              :to="{ path: '/archive/update/' + row.item.id }"
              v-b-tooltip.hover.top.v-primary
              :title="$t('Таҳрирлаш')"
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
  name: "archive-index",
  data: function() {
    return {
      role: null,
      users: [],
      filter: null,
      totalRows: 1,
      currentPage: 1,
      checkTable: false,
      perPage: 50,
      fields: [
        {
          key: "index",
          label: "#",
          sortable: false
        },
        {
          key: "created_at",
          label: this.$i18n.t("Келган Вақти"),
          formatter: (value, key, item) => {
            return moment.unix(value).format("DD.MM.YYYY HH:mm:ss");
          }
        },
        {
          key: "patient.fullname",
          label: this.$i18n.t("Бемор"),
          sortable: true
        },
        {
          key: "user.username",
          label: this.$i18n.t("Ходим"),
          sortable: true
        },
        {
          key: "actions",
          label: ""
        }
      ]
    };
  },
  async mounted() {
    this.role = localStorage.getItem("role");
    await this.Data();
  },
  methods: {
    async Data() {
      let self = this;
      self.checkTable = true;
      //get list of documents => hujjatlarni olish
      if (this.role == this.$store.state.REGISTRATION) {
        var urlx =
          "api/registration_history/branch/" +
          localStorage.getItem("branch_id");
      } else if (this.role == this.$store.state.DOCTOR) {
        var urlx =
          "api/registration_history/doctor/" + localStorage.getItem("oid");
      } else if (this.role == this.$store.state.LABARATORY) {
        var urlx =
          "api/registration_history/inspection/" + localStorage.getItem("oid");
      } else {
        var urlx = "api/registration_history";
      }
      try {
        const response = await self.axios.get(urlx);
        self.users = response.data;
        self.totalRows = self.users.length;
        self.checkTable = false;
      } catch (error) {}
    },
    UpdatePatient(item) {
      this.$router.push({ path: "/archive/update/" + item.id });
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
  height: 100vh;
  overflow-y: auto;
}
</style>
