<template>
  <b-container fluid="sm" class="all-div-height">
    <md-card>
      <md-card-header data-background-color="green">
        <h4 class="title">Ҳодимлар рўйҳати</h4>
      </md-card-header>
      <md-card-content>
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
              @click="Refresh()"
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
        <div class="table-height mt-2">
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
              {{ row.value.full_name }}
              {{ row.value.position.full_name }}
              {{ row.value.section.full_name }}
              {{ row.value.password }}
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
                      <th>Асосий Улуши (%):</th>
                      <td>{{ row.item.percent_price }}</td>
                    </tr>
                    <tr>
                      <th>Хонадан Оладиган Улуши (%):</th>
                      <td>{{ row.item.percent_room }}</td>
                    </tr>
                    <tr>
                      <th>Консультациядан Оладиган Улуши (%):</th>
                      <td>{{ row.item.percent_consultation }}</td>
                    </tr>
                    <tr>
                      <th>Текширувлардан Оладиган Улуши (%):</th>
                      <td>{{ row.item.percent_inspection }}</td>
                    </tr>
                  </tbody>
                </table>
              </b-card>
            </template>
          </b-table>
        </div>
        <b-col sm="5" md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
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
    perPage: 20,
    fields: [
      {
        key: "index",
        label: "#",
        sortable: false
      },
      {
        key: "full_name",
        label: "ФИШ",
        sortable: true
      },
      {
        key: "position.full_name",
        label: "Ҳуқуқи",
        sortable: true
      },
      {
        key: "section.full_name",
        label: "Бўлим",
        sortable: true
        // Variant applies to the whole column, including the header and footer
        // variant: 'danger'
      },
      {
        key: "password",
        label: "Парол",
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
      //get list of staff => hodimlarni olish
      axios({
        url: "universal/staff_list",
        method: "get",
        params: {
          id: localStorage.getItem("branch_id")
        }
      }).then(function(response) {
        self.users = response.data.data;
        self.totalRows = self.users.length;
      });
    },
    Delete(id) {
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
              method: "get",
              url: "staff/delete_staff",
              params: {
                id: id
              }
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
    },
    Refresh() {
      this.Data();
    }
  }
};
</script>

<style lang="scss" scoped>
.md-field {
  max-width: 300px;
}
.table-height {
  height: 370px;
}
</style>
