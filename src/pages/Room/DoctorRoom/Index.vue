<template>
  <b-container fluid class="all-div-height">
    <md-card>
      <md-card-header data-background-color="green">
        <h4 class="title">Хоналар рўйҳати</h4>
      </md-card-header>
      <md-card-content>
        <!-- button group and search section start -->
        <b-row>
          <b-col>
            <b-button
              :to="{ path: '/room/doctorroom/create' }"
              style="color: #ffffff;"
              variant="success"
              v-b-tooltip.hover.v-success.topright
              title="Хона қўшиш"
            >
              <b-icon icon="plus" font-scale="1.3"></b-icon>
            </b-button>
            &nbsp;
            <b-button
              size="md"
              @click="Data()"
              v-b-tooltip.hover.v-primary
              variant="primary"
              title="Янгилаш"
            >
              <b-icon icon="arrow-clockwise"></b-icon>
            </b-button>
          </b-col>
          <b-col>
            <b-form-group
              label-for="filter-input"
              label-cols-sm="0"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
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
        <!-- button group and search section end -->
        <!-- table section start -->
        <div class="table-height mt-2">
          <div class="d-flex justify-content-center mb-3" v-if="checkTable">
            <b-spinner
              variant="info"
              style="width: 3rem; height: 3rem;"
              type="grow"
              label="Spinning"
            ></b-spinner>
          </div>
          <b-table
            sticky-header="500px"
            striped
            hover
            :items="doctor_rooms"
            :fields="fields"
            :filter="filter"
            :current-page="currentPage"
            :per-page="perPage"
            small
            bordered
            @row-clicked="UpdateDoctorRoom"
            style="cursor:pointer"
          >
            <template #cell(index)="row">
              {{ row.index + 1 }}
            </template>
            <template #cell(items)="row">
              {{ row.value.name }}
              {{ row.value.branch.name }}
            </template>
            <template #cell(actions)="row">
              <b-button-group>
                <b-button
                  variant="outline-primary"
                  size="sm"
                  :to="{ path: '/room/doctorroom/update/' + row.item.id }"
                  v-b-tooltip.hover.left.v-primary
                  style="color: #1E90FF"
                  title="Таҳрирлаш"
                >
                  <b-icon icon="Pencil" font-scale="0.9"></b-icon>
                </b-button>

                <b-button
                  size="sm"
                  @click="Delete(row.item.id)"
                  variant="outline-danger"
                  v-b-tooltip.hover.right.v-danger
                  title="Ўчириш"
                >
                  <b-icon icon="trash" font-scale="0.9"></b-icon>
                </b-button>
              </b-button-group>
            </template>
          </b-table>
        </div>
        <!-- table section end -->
        <!-- pagination section start -->
        <b-col sm="5" md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
        <!-- pagination section end -->
      </md-card-content>
    </md-card>
  </b-container>
</template>

<script>
const axios = require("axios");
export default {
  name: "doctor-room-index",
  data: () => ({
    doctor_rooms: [],
    filter: null,
    totalRows: 1,
    currentPage: 1,
    checkTable: false,
    perPage: 20,
    fields: [
      {
        key: "index",
        label: "#",
        sortable: false
      },
      {
        key: "name",
        label: "Хона Рақами",
        sortable: true
      },
      {
        key: "branch.name",
        label: "Филиал",
        sortable: true
      },
      {
        key: "actions",
        label: ""
      }
    ]
  }),
  async mounted() {
    await this.Data();
  },
  methods: {
    async Data() {
      let self = this;
      self.checkTable = true;
      //get list of doctor_rooms => xonalar ro'yhatini olish
      try {
        const response = await self.axios.get("api/room");
        self.doctor_rooms = response.data;
        self.totalRows = self.doctor_rooms.length;
        self.checkTable = false;
      } catch (error) {}
    },
    Delete(id) {
      this.$bvModal
        .msgBoxConfirm("Ҳақиқатан ҳам ўчиришни хоҳлайсизми?", {
          title: "Илтимос тасдиқланг!",
          size: "md",
          buttonSize: "md",
          okVariant: "outline-danger",
          okTitle: "Ҳа",
          cancelTitle: "Йўқ",
          cancelVariant: "info",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: false
        })
        .then(value => {
          let response = value;
          let self = this;
          if (response === true) {
            axios({
              method: "delete",
              url: "api/room/id/" + id
            }).then(function(response) {
              self.Data();
            });
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    UpdateDoctorRoom(item) {
      let self = this;
      self.$router.push({ path: "/room/doctorroom/update/" + item.id });
    }
  }
};
</script>

<style lang="scss" scoped>
.md-field {
  max-width: 300px;
}
</style>
