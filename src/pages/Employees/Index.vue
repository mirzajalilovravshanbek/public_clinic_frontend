<template>
  <b-container fluid="sm" class="all-div-height">
    <md-card>
      <md-card-header data-background-color="green">
        <h4 class="title">Ҳодимлар рўйҳати</h4>
      </md-card-header>
      <md-card-content>
        <!-- button group and search section start -->
        <b-row>
          <b-col>
            <b-button
              :to="{ path: '/employees/create' }"
              style="color: #ffffff;"
              variant="success"
              v-b-tooltip.hover.v-success.topright
              title="Ҳодим қўшиш"
            >
              <b-icon icon="person-plus"></b-icon>
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
            <b-spinner variant="info" style="width: 3rem; height: 3rem;" type="grow" label="Spinning"></b-spinner>
          </div>
          <b-table
            sticky-header="500px"
            striped
            hover
            :items="users"
            :fields="fields"
            :filter="filter"
            :current-page="currentPage"
            :per-page="perPage"
            small
            bordered
            @row-clicked="UpdateEmployee"
            style="cursor:pointer"
          >
            <template #cell(index)="row">
              {{ row.index + 1 }}
            </template>
            <template #cell(items)="row">
              {{ row.value.username }}
              {{ row.value.role }}
              {{ row.value.branch.name }}
              {{ row.value.room.name }}
            </template>
            <template #cell(actions)="row">
              <span class="h5 mb-2">
                <b-button-group>
                  <b-button
                    variant="outline-primary"
                    size="sm"
                    :to="{ path: '/employees/update/' + row.item.id }"
                    v-b-tooltip.hover.left.v-primary
                    style="color: #1E90FF"
                    title="Таҳрирлаш"
                  >
                    <b-icon icon="Pencil" font-scale="0.9"></b-icon>
                  </b-button>

                  <b-button
                    size="sm"
                    variant="outline-success"
                    @click="row.toggleDetails"
                    v-b-tooltip.hover.bottomright.v-success
                    :title="row.detailsShowing ? 'Беркитиш' : 'Кўриш'"
                  >
                    <b-icon
                      :icon="row.detailsShowing ? 'eye-slash' : 'eye'"
                      font-scale="0.9"
                    ></b-icon>
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
              </span>
            </template>
            <template #row-details="row">
              <b-card>
                <table class="table table-bordered table-sm">
                  <tbody>
                    <tr>
                      <th>Шифокор:</th>
                      <td>{{ row.item.doctor != null ? row.item.doctor.name : "" }}</td>
                    </tr>
                    <tr>
                      <th>Текширув Бўлими:</th>
                      <td>{{ row.item.inspection_category != null ? row.item.inspection_category.name : "" }}</td>
                    </tr>
                    <tr>
                      <th>Тўлов Тури:</th>
                      <td>{{ row.item.type == 'salary' ? "Ойлик" : "Фоиз" }}</td>
                    </tr>
                    <tr>
                      <th>Ойлик:</th>
                      <td>{{ row.item.salary }}</td>
                    </tr>
                  </tbody>
                </table>
              </b-card>
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
  name: "employees-index",
  data: () => ({
    users: [],
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
        key: "username",
        label: "ФИШ",
        sortable: true
      },
      {
        key: "role",
        label: "Ҳуқуқи",
        sortable: true
      },
      {
        key: "branch.name",
        label: "Филиал",
        sortable: true
        // Variant applies to the whole column, including the header and footer
        // variant: 'danger'
      },
      {
        key: "room.name",
        label: "Хона",
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
      //get list of staff => hodimlarni olish
      try {
        const response = await self.axios.get("api/user");
        self.users = response.data;
        self.totalRows = self.users.length;
        self.checkTable = false;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    async Delete(id) {
      this.$bvModal
        .msgBoxConfirm("Ҳақиқатан ҳам ўчиришни хоҳлайсизми?", {
          title: "Илтимос тасдиқланг!",
          size: "md",
          okVariant: "outline-danger",
          okTitle: "Ҳа",
          cancelTitle: "Йўқ",
          cancelVariant: "info",
          hideHeaderClose: false,
          centered: false
        })
        .then(value => {
          let response = value;
          let self = this;
          if (response === true) {
            axios({
              method: "delete",
              url: "api/user/id/"+id
            }).then(function(response) {
             self.Data();
            });
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    UpdateEmployee(item) {
      let self = this;
      self.$router.push({ path: "/employees/update/" + item.id });
    }
  }
};
</script>

<style lang="scss" scoped>
.md-field {
  max-width: 300px;
}
</style>
