<template>
  <b-container fluid class="all-div-height">
    <md-card>
      <md-card-header data-background-color="green">
        <h4 class="title">Шифокор Бўлимлари</h4>
      </md-card-header>
      <md-card-content>
        <!-- button group and search section start -->
        <b-row>
          <b-col>
            <b-button
              :to="{ path: '/doctorcategory/create' }"
              style="color: #ffffff;"
              variant="success"
              v-b-tooltip.hover.v-success.topright
              :title="$t('Қўшиш')"
            >
              <b-icon icon="plus" font-scale="1.3"></b-icon>
            </b-button>
            &nbsp;
            <b-button
              size="md"
              @click="Data()"
              v-b-tooltip.hover.v-primary
              variant="primary"
              :title="$t('Янгилаш')"
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
            :items="doctor_category"
            :fields="fields"
            :filter="filter"
            :current-page="currentPage"
            :per-page="perPage"
            small
            bordered
            @row-clicked="UpdateDoctorCategory"
            style="cursor:pointer"
          >
            <template #cell(index)="row">
              {{ row.index + 1 }}
            </template>
            <template #cell(items)="row">
              {{ row.value.name }}
              {{ row.value.price }}
            </template>
            <template #cell(actions)="row">
              <b-button-group>
                <b-button
                  variant="outline-primary"
                  size="sm"
                  :to="{ path: '/doctorcategory/update/' + row.item.id }"
                  v-b-tooltip.hover.left.v-primary
                  style="color: #1E90FF"
                  :title="$t('Таҳрирлаш')"
                >
                  <b-icon icon="Pencil" font-scale="0.9"></b-icon>
                </b-button>

                <b-button
                  size="sm"
                  @click="Delete(row.item.id)"
                  variant="outline-danger"
                  v-b-tooltip.hover.right.v-danger
                  :title="$t('Ўчириш')"
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
  name: "doctor-category-index",
  data: () => ({
    doctor_category: [],
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
        label: "Бўлим номи",
        sortable: true
      },
      {
        key: "price",
        label: "Нархи",
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
      //get list of doctor_category => bo'limlar ro'yhatini olish
      try {
        const response = await self.axios.get("api/doctor_category");
        self.doctor_category = response.data;
        self.totalRows = self.doctor_category.length;
        self.checkTable = false;
      } catch (error) {}
    },
    Delete(id) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete?", {
          title: "Please confirm!",
          size: "md",
          buttonSize: "md",
          okVariant: "outline-danger m-0 ml-2",
          okTitle: "Yes",
          cancelTitle: "No",
          cancelVariant: "info m-0",
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
              url: "api/doctor_category/id/" + id
            }).then(function(response) {
              self.Data();
            });
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    UpdateDoctorCategory(item) {
      let self = this;
      self.$router.push({ path: "/doctorcategory/update/" + item.id });
    }
  }
};
</script>

<style lang="scss" scoped>
.md-field {
  max-width: 300px;
}
</style>
