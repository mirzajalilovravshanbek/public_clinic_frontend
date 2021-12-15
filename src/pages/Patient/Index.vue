<template>
  <b-container fluid="sm" class="cont-height">
    <!-- button panel start -->
    <b-row>
      <b-col
        sm="2"
        md="2"
        lg="2"
        xl="2"
        v-if="
          $cookies.get('user').position === $store.state.REGISTRATION ||
            $cookies.get('user').position === $store.state.DOCTOR ||
            $cookies.get('user').position === $store.state.ITMED
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
          @click="Refresh()"
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
          $cookies.get('user').position === $store.state.KASSA ||
            $cookies.get('user').position === $store.state.LABARATORY ||
            $cookies.get('user').position === $store.state.UZI
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
            {{ row.value.patient.full_name }}
            {{ row.value.staff.full_name }}
          </template>
          <template #cell(actions)="row">
            <b-button-group>
              <b-button
                v-if="
                  $cookies.get('user').position === $store.state.DOCTOR ||
                    $cookies.get('user').position === $store.state.ITMED
                "
                variant="outline-danger"
                size="sm"
                v-b-tooltip.hover.left.v-danger
                title="Якунлаш"
                @click="CompleteDocument(row.item.id)"
              >
                <b-icon icon="file-earmark-x-fill"></b-icon>
              </b-button>

              <b-button
                variant="outline-primary"
                target="_blank"
                size="sm"
                style="color: #1E90FF"
                :to="{ path: '/patient/update/' + row.item.id }"
                v-b-tooltip.hover.top.v-primary
                title="Таҳрирлаш"
              >
                <b-icon icon="Pencil"></b-icon>
              </b-button>

              <b-button
                variant="outline-success"
                v-b-tooltip.hover.right.v-success
                size="sm"
                title="Печат"
                @click="Print(row.item.id)"
                v-if="
                  $cookies.get('user').position === $store.state.DOCTOR ||
                    $cookies.get('user').position === $store.state.ITMED ||
                    $cookies.get('user').position ===
                      $store.state.REGISTRATION ||
                    $cookies.get('user').position === $store.state.KASSA
                "
              >
                <b-icon icon="printer-fill"></b-icon>
              </b-button>
            </b-button-group>
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
        key: "patient.full_name",
        label: "Бемор",
        sortable: true
      },
      {
        key: "staff.full_name",
        label: "Рўйҳатга олган ходим",
        sortable: true
      },
      {
        key: "actions",
        label: ""
      }
    ]
  }),
  mounted() {
    this.Data();
  },
  methods: {
    Data() {
      let self = this;
      //get list of documents => hujjatlarni olish
      axios({
        url: "universal/registration_list",
        method: "get",
        params: {
          id: localStorage.getItem("branch_id")
        }
      }).then(function(response) {
        self.users = response.data.data;
        self.totalRows = self.users.length;
      });
    },
    CompleteDocument(id) {
      let self = this;
      axios({
        url: "staff/register_complate",
        method: "post",
        data: {
          doctor_id: self.$cookies.get("user").id,
          register_id: id
        }
      }).then(function(response) {
        alert("Ҳужжат Ёпилди!");
      });
    },
    Refresh() {
      this.Data();
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
    Print(id) {
      let self = this;

      axios({
        url: "universal/print_turn",
        method: "get",
        params: {
          id: id
        }
      }).then(function(response) {
        // console.log(response.data)
        self.$cookies.set("printData", response.data);
        const route = self.$router.resolve({
          path: "/patient/checkprint"
        });
        window.open(route.href, "_blank");
      });
    },
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.status === 0) return "table-danger";
    }
  },
  computed: {
    filteredData() {
      let self = this;
      if (
        self.$cookies.get("user").position === self.$store.state.DOCTOR ||
        self.$cookies.get("user").position === self.$store.state.UZI ||
        self.$cookies.get("user").position === self.$store.state.LABARATORY
      ) {
        return this.users.filter(users => users.status === 1);
      } else {
        return this.users;
      }
      return this.users;
    }
  }
};
</script>
<style scoped>
.cont-height {
  height: 600px;
}
.card-margin {
  margin: 0;
}
.div-body {
  height: 480px;
  overflow-y: auto;
}
</style>
