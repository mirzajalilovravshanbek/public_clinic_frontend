<template>
  <b-container fluid="sm" style="height: 600px;">
    <md-card>
      <md-card-header data-background-color="green">
        <h4 class="title">Текширувлар рўйҳати</h4>
      </md-card-header>
      <md-card-content>
        <b-row>
          <b-col>
            <b-button
              :to="{ path: '/inspections/create' }"
              style="color: #ffffff;"
              variant="success"
              v-b-tooltip.hover.v-success.topright
              title="Текширув қўшиш"
            >
              <b-icon icon="plus" font-scale="1.3"></b-icon>
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
            sticky-header="420px"
            striped
            hover
            :items="inspections"
            :fields="fields"
            :filter="filter"
            :current-page="currentPage"
            :per-page="perPage"
            small
            bordered
          >
            <template #cell(index)="row">
              {{ row.index + 1 }}
            </template>
            <template #cell(items)="row">
              {{ row.value.full_name }}
            </template>
            <template #cell(actions)="row">
              <b-button-group>
                <b-button
                  size="sm"
                  variant="outline-success"
                  @click="row.toggleDetails"
                  v-b-tooltip.hover.right.v-success
                  :title="row.detailsShowing ? 'Беркитиш' : 'Кўриш'"
                >
                  <b-icon
                    :icon="row.detailsShowing ? 'eye-slash' : 'eye'"
                    font-scale="0.9"
                  ></b-icon>
                </b-button>
              </b-button-group>
            </template>
            <template #row-details="row">
              <b-card>
                <table class="table table-bordered table-sm">
                  <thead>
                    <th>#</th>
                    <th>Текширув:</th>
                    <th>Нархи:</th>
                    <th></th>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in row.item.children"
                      :key="index"
                      style="cursor:pointer;"
                    >
                      <th @click="UpdateInspection(item.id)">
                        {{ index + 1 }}
                      </th>
                      <td @click="UpdateInspection(item.id)">
                        {{ item.full_name }}
                      </td>
                      <td @click="UpdateInspection(item.id)">
                        {{ item.price }}
                      </td>
                      <td>
                        <b-button-group>
                          <b-button
                            variant="outline-primary"
                            size="sm"
                            :to="{ path: '/inspections/update/' + item.id }"
                            v-b-tooltip.hover.left.v-primary
                            style="color: #1E90FF"
                            title="Таҳрирлаш"
                          >
                            <b-icon icon="Pencil" font-scale="0.9"></b-icon>
                          </b-button>

                          <b-button
                            size="sm"
                            @click="Delete(item.id)"
                            variant="outline-danger"
                            v-b-tooltip.hover.right.v-danger
                            title="Ўчириш"
                          >
                            <b-icon icon="trash" font-scale="0.9"></b-icon>
                          </b-button>
                        </b-button-group>
                      </td>
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
  name: "patient-room-index",
  data: () => ({
    inspections: [],
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
        label: "Муассаса",
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
      //get list of inspections => tekshiruvlar ro'yhatini olish
      axios({
        url: "inspection/section_list",
        method: "get"
      }).then(function(response) {
        self.inspections = response.data.data;
        self.totalRows = self.inspections.length;
      });
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
              method: "get",
              url: "inspection/inspection_delete?id=" + id
            }).then(function(response) {
              self.Data();
            });
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    UpdateInspection(id) {
      let self = this;
      self.$router.push({ path: "/inspections/update/" + id });
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
  height: 430px;
}
</style>
