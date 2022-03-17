<template>
  <b-container fluid class="all-div-height">
    <md-card>
      <md-card-header data-background-color="green">
        <h4 class="title">Беморлар</h4>
      </md-card-header>
      <md-card-content>
        <!-- button group and search section start -->
        <b-row>
          <b-col>
            <b-button
              :to="{ path: '/patientcrud/create' }"
              style="color: #ffffff;"
              variant="success"
              v-b-tooltip.hover.v-success.topright
              title="Бемор қўшиш"
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
            :items="patients"
            :fields="fields"
            :filter="filter"
            :current-page="currentPage"
            :per-page="perPage"
            small
            bordered
            @row-clicked="UpdatePatient"
            style="cursor:pointer"
          >
            <template #cell(index)="row">
              {{ row.index + 1 }}
            </template>
            <template #cell(items)="row">
              {{ row.value.lastname != null ? row.item.lastname : "" }}
              {{ row.value.name != null ? row.item.name : "" }}
              {{ row.value.patronymic != null ? row.item.patronymic : "" }}
              {{ row.value.phone != null ? row.item.phone : "" }}
              {{ row.value.birthday != null ? row.item.birthday : "" }}
            </template>
            <template #cell(actions)="row">
              <b-button-group>
                <b-button
                  variant="outline-primary"
                  size="sm"
                  :to="{ path: '/patientcrud/update/' + row.item.id }"
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
            </template>
            <template #row-details="row">
              <b-card>
                <table class="table table-bordered table-sm">
                  <tbody>
                    <tr>
                      <th>Вилоят:</th>
                      <td>
                        {{
                          row.item.region != null ? row.item.region.name : ""
                        }}
                      </td>
                    </tr>
                    <tr>
                      <th>Туман:</th>
                      <td>
                        {{
                          row.item.district != null
                            ? row.item.district.name
                            : ""
                        }}
                      </td>
                    </tr>
                    <tr>
                      <th>МФЙ:</th>
                      <td>
                        {{
                          row.item.neighboarhood != null
                            ? row.item.neighboarhood.name
                            : ""
                        }}
                      </td>
                    </tr>
                    <tr>
                      <th>Манзил:</th>
                      <td>
                        {{ row.item.address != null ? row.item.address : "" }}
                      </td>
                    </tr>
                    <tr>
                      <th>Жинси:</th>
                      <td>{{ row.item.gender == "male" ? "Эркак" : "Аёл" }}</td>
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
import moment from "moment";
export default {
  name: "patient-crud-index",
  data: () => ({
    patients: [],
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
        key: "lastname",
        label: "Фамилия",
        sortable: true
      },
      {
        key: "name",
        label: "Исми",
        sortable: true
      },
      {
        key: "patronymic",
        label: "Отасини Исми",
        sortable: true
      },
      {
        key: "passport",
        label: "Паспорт",
        sortable: true
      },
      {
        key: "phone",
        label: "Телефон",
        sortable: true
      },
      {
        key: "birthday",
        label: "Туғилган Сана",
        formatter: (value, key, item) => {
          return moment.unix(value).format("DD.MM.YYYY");
        }
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
      //get list of patients => bemorlar ro'yhatini olish
      try {
        const response = await self.axios.get("api/patient");
        self.patients = response.data;
        self.totalRows = self.patients.length;
        self.checkTable = false;
      } catch (error) {
        self.$store.state.errors = error;
      }
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
              url: "api/patient/id/" + id
            }).then(function(response) {
              self.Data();
            });
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    UpdatePatient(item) {
      let self = this;
      self.$router.push({ path: "/patientcrud/update/" + item.id });
    }
  }
};
</script>

<style lang="scss" scoped>
.md-field {
  max-width: 300px;
}
</style>
