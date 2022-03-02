<template>
  <b-container fluid>
    <b-card no-body class="rmk-card">
      <b-row class="pt-2 px-2">
        <!-- inspection name input start -->
        <b-col sm="4" md="4" lg="4" xl="4">
          <label for="input-ins-name" class="m-0"
            >Текширув Номи<sup class="text-danger">*</sup></label
          >
          <b-form-input
            id="input-ins-name"
            type="text"
            v-model="datas.name"
            class="form-control rmk-input px-1"
          ></b-form-input>
        </b-col>
        <!-- inspection name input end -->

        <!-- inspection price input start -->
        <b-col sm="3" md="3" lg="3" xl="3">
          <label for="input-price" class="m-0">Нархи</label>
          <b-form-input
            id="input-price"
            type="number"
            v-model="datas.price"
            class="form-control rmk-input px-1"
            :disabled="datas.type == true"
          ></b-form-input>
        </b-col>
        <!-- inspection price input end -->

        <!-- button group start -->
        <b-col md="5" sm="5" lg="5" xl="5" class="pt-3 text-center">
          <b-button
            size="md"
            variant="success"
            @click="Save()"
            :disabled="sending"
          >
            <b-spinner small v-if="sending"></b-spinner>
            <b-icon icon="clipboard-check"></b-icon>
            Сақлаш
          </b-button>
          &nbsp; &nbsp;
          <b-button
            size="md"
            variant="outline-danger"
            @click="
              Cancel();
              sending = false;
            "
          >
            <b-icon icon="clipboard-x"></b-icon>
            Бекор қилиш
          </b-button>
          &nbsp; &nbsp;
          <b-button
            size="md"
            variant="info"
            :to="{ path: '/inspections/index' }"
            style="color: #ffffff;"
          >
            <b-icon icon="arrow-left"></b-icon>
            Орқага
          </b-button>
        </b-col>
        <!-- button group end -->
      </b-row>
      <b-row class="pt-1 px-2">
        <!-- inspection branch input start -->
        <b-col sm="4" md="4" lg="4" xl="4">
          <label for="input-normative" class="m-0"
            >Филиал<sup class="text-danger">*</sup></label
          >
          <v-select
            id="input-normative"
            :clearable="true"
            :options="branches"
            v-model="datas.branch_id"
            :reduce="name => name.id"
            label="name"
            placeholder="Филиални танланг..."
            @input="GetUsers()"
          >
          </v-select>
        </b-col>
        <!-- inspection branch input end -->

        <!-- inspection user input start -->
        <b-col sm="4" md="4" lg="4" xl="4">
          <label for="input-user" class="m-0">Ходим</label>
          <v-select
            id="input-user"
            :clearable="true"
            :options="users"
            v-model="datas.user_id"
            :reduce="username => username.id"
            label="username"
            placeholder="Ходимни танланг..."
            @input="GetUsers()"
          >
          </v-select>
        </b-col>
        <!-- inspection user input end -->

        <!-- inspection percent bonus input start -->
        <b-col sm="4" md="4" lg="4" xl="4">
          <label for="input-percent-bonus" class="m-0">Бонус Фоизи</label>
          <b-form-input
            id="input-percent-bonus"
            type="number"
            v-model="datas.percent_bonus"
            class="form-control rmk-input px-1"
          ></b-form-input>
        </b-col>
        <!-- inspection percent bonus input end -->
      </b-row>
      <b-row class="pt-1 px-2">
        <!-- inspection category input start -->
        <b-col sm="4" md="4" lg="4" xl="4">
          <label for="input-category" class="m-0">Текширув Бўлими</label>
          <v-select
            id="input-category"
            :clearable="true"
            :options="categories"
            v-model="datas.category_id"
            :reduce="name => name.id"
            label="name"
            placeholder="Бўлимини танланг..."
            @input="GetUsers()"
          >
          </v-select>
        </b-col>
        <!-- inspection category input end -->

        <!-- inspection parent input start -->
        <b-col sm="4" md="4" lg="4" xl="4">
          <label for="input-parent" class="m-0">Папка</label>
          <v-select
            id="input-parent"
            :clearable="true"
            :options="inspection_folders"
            v-model="datas.parent_id"
            :reduce="name => name.id"
            label="name"
            placeholder="Папкани танланг..."
          >
          </v-select>
        </b-col>
        <!-- inspection parent input end -->

        <!-- inspection type input start -->
        <b-col sm="4" md="4" lg="4" xl="4">
          <b-form-checkbox
            id="checkbox"
            v-model="datas.type"
            name="checkbox"
            class="mt-4"
          >
            Танланадиган
          </b-form-checkbox>
        </b-col>
        <!-- inspection type input end -->
      </b-row>
      <b-row class="p-2 px-2">
        <b-col sm="12" md="12" lg="12" xl="12" class="rmk-table-div">
          <table
            class="table table-hover table-striped table-bordered table-sm mt-1"
          >
            <thead>
              <tr class="table-primary">
                <th class="rmk-table-middle">
                  #
                  <b-button
                    @click="Addrow()"
                    style="color: #ffffff;"
                    variant="info"
                    size="sm"
                    v-b-tooltip.hover.v-info.topright
                    title="Қатор қўшиш"
                    >+</b-button
                  >
                </th>
                <th style="width:400px" class="rmk-table-middle">Анализ</th>
                <th class="rmk-table-middle">Норма</th>
                <th class="rmk-table-middle">Нархи</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in datas.child" :key="index">
                <th>{{ index + 1 }}</th>
                <td>
                  <input
                    class="form-control px-1 form-control-sm"
                    type="text"
                    v-model="item.name"
                  />
                </td>
                <td>
                  <input
                    class="form-control px-1 form-control-sm"
                    type="text"
                    v-model="item.norm"
                  />
                </td>
                <td>
                  <input
                    class="form-control px-1 form-control-sm"
                    type="number"
                    v-model="item.price"
                    :disabled="datas.type == false"
                    @change="Addrow()"
                  />
                </td>
                <td class="text-center">
                  <b-icon
                    icon="trash"
                    style="cursor: pointer;"
                    variant="danger"
                    font-scale="1.2"
                    v-b-tooltip.hover.v-danger.right="'Қаторни Ўчириш'"
                    @click="RemoveIns(index)"
                  ></b-icon>
                </td>
              </tr>
            </tbody>
          </table>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>
<script>
const axios = require("axios");
export default {
  name: "inspection-index",
  data: () => ({
    datas: {
      name: null,
      price: null,
      type: false,
      branch_id: null,
      parent_id: 0,
      user_id: null,
      category_id: null,
      percent_bonus: null,
      child: []
    },
    branches: [],
    inspection_folders: [],
    users: [],
    categories: [],
    sending: false,
    id: null
  }),
  async mounted() {
    let self = this;
    await self.GetBranches();
    await self.GetFolders();
    await self.GetInspectionCategory();
    // tekshiruvni tahrirlash
    if (self.$route.path != "/inspections/create") {
      let id = self.$route.params.id;
      try {
        const response = await self.axios.get("api/inspection/id/" + id);
        self.datas = response.data;
        await self.GetUsers();
      } catch (error) {
        self.$store.state.errors = error;
      }
    }
  },
  methods: {
    async GetBranches() {
      let self = this;
      //filiallar ro'yhati
      try {
        const response = await self.axios.get("api/branch");
        self.branches = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    async GetInspectionCategory() {
      let self = this;
      //tekshiruv bo'limlari ro'yhati
      try {
        const response = await self.axios.get("api/inspection_category");
        self.categories = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    async GetFolders() {
      let self = this;
      //papkalar ro'yhati
      try {
        const response = await self.axios.get("api/inspection_folder");
        self.inspection_folders = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    async GetUsers() {
      let self = this;
      //usernamelar ro'yhati
      if (self.datas.branch_id != null) {
        try {
          const response = await self.axios.get(
            "api/user/branch/" + self.datas.branch_id
          );
          self.users = response.data;
        } catch (error) {
          self.$store.state.errors = error;
        }
      }
    },
    Addrow() {
      this.datas.child.push({
        name: null,
        norm: null,
        parent_id: 0,
        price: null
      });
    },
    RemoveIns(index) {
      let self = this;
      self.datas.child.splice(index, 1);
    },
    async Save() {
      let self = this;
      self.sending = true;
      if (self.$route.path == "/inspections/create") {
        var methods = "post";
        var action = "api/inspection";
      } else {
        var methods = "patch";
        var action = "api/inspection/id/" + self.$route.params.id;
      }
      try {
        const response = await axios({
          method: methods,
          url: action,
          data: self.datas
        });
        self.sending = false;
        self.$router.push("/inspections/index");
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    Cancel() {
      this.datas.name = null;
      this.datas.price = null;
      this.datas.type = false;
      this.datas.branch_id = null;
      this.datas.parent_id = 0;
      this.datas.user_id = null;
      this.datas.category_id = null;
      this.datas.percent_bonus = null;
      this.datas.child = [];
    }
  }
};
</script>
<style scoped>
.rmk-card {
  height: 600px;
}
.rmk-input {
  border: 1px solid blue;
  border-radius: 3px;
}
.rmk-table-middle {
  vertical-align: middle;
}
.rmk-table-div {
  height: 400px;
  overflow-y: auto;
}
</style>
