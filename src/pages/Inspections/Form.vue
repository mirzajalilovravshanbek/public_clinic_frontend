<template>
  <b-container fluid>
    <b-card no-body class="rmk-card">
      <b-row class="pt-2 px-2">
        <b-col sm="5" md="5" lg="5" xl="5">
          <label for="input-ins-name" class="m-0">Текширув Номи</label>
          <b-form-input
            id="input-ins-name"
            type="text"
            v-model="datas.full_name"
            class="form-control rmk-input px-1"
          ></b-form-input>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3">
          <label for="input-price" class="m-0">Нархи</label>
          <b-form-input
            id="input-price"
            type="number"
            v-model="datas.price"
            class="form-control rmk-input px-1"
            :disabled="datas.chekable == '1'"
          ></b-form-input>
        </b-col>
        <b-col md="4" sm="4" lg="4" xl="4" class="pt-3 text-center">
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
        </b-col>
        <b-col sm="12" md="12" lg="12" xl="12">
          <label for="input-normative" class="m-0">Норма</label>
          <b-form-input
            id="input-normative"
            type="text"
            v-model="datas.normative"
            class="form-control rmk-input px-1"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="p-2 px-2">
        <b-col sm="12" md="12" lg="12" xl="12">
          <b-form-checkbox
            id="checkbox"
            v-model="datas.chekable"
            name="checkbox"
            value="1"
            unchecked-value="0"
          >
            Танланадиган
          </b-form-checkbox>
        </b-col>
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
              <tr v-for="(item, index) in datas.child_table" :key="index">
                <th>{{ index + 1 }}</th>
                <td>
                  <input
                    class="form-control px-1 form-control-sm"
                    type="text"
                    v-model="item.full_name"
                  />
                </td>
                <td>
                  <input
                    class="form-control px-1 form-control-sm"
                    type="text"
                    v-model="item.normative"
                  />
                </td>
                <td>
                  <input
                    class="form-control px-1 form-control-sm"
                    type="number"
                    v-model="item.price"
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
      full_name: null,
      price: null,
      chekable: "0",
      isfolder: 0,
      parent_id: 0,
      normative: null,
      type_id: 1,
      child_table: []
    },
    sending: false,
    id: null
  }),
  mounted() {
    let self = this;
    axios({
      url: "inspection/inspection_section",
      method: "get",
      params: {
        id: localStorage.getItem("branch_id")
      }
    }).then(function(response) {
      self.id = response.data.data[0].id;
    });

    // tekshiruvni tahrirlash
    if (self.$route.path != "/inspections/create") {
      axios({
        url: "inspection/list_with_child",
        method: "get",
        params: {
          id: self.$route.params.id
        }
      }).then(function(response) {
        self.datas = response.data.data;
      });
    }
  },
  methods: {
    Addrow() {
      this.datas.child_table.push({
        full_name: null,
        normative: null,
        price: null
      });
    },
    RemoveIns(index) {
      let self = this;
      self.datas.child_table.splice(index, 1);
    },
    Save() {
      let self = this;
      self.sending = true;
      if (self.$route.path == "/inspections/create") {
        var methods = "post";
        var action = "inspection/inspection_create?id=" + self.id;
      } else {
        var methods = "post";
        var action = "inspection/inspection_update?id=" + self.$route.params.id;
      }
      axios({
        method: methods,
        url: action,
        data: self.datas
      }).then(function(response) {
        self.sending = false;
        if (response.data.status == true) {
          self.$router.push("/inspections/index");
        } else {
          alert(response.data.message);
        }
      });
    },
    Cancel() {
      (this.datas.full_name = null),
        (this.datas.price = null),
        (this.datas.chekable = "0"),
        (this.datas.isfolder = 0),
        (this.datas.parent_id = 0),
        (this.datas.normative = null),
        (this.datas.child_table = []);
    }
  }
};
</script>
<style scoped>
.rmk-card {
  height: 548px;
}
.rmk-input {
  border: 1px solid blue;
  border-radius: 3px;
}
.rmk-table-middle {
  vertical-align: middle;
}
.rmk-table-div {
  height: 390px;
  overflow-y: auto;
}
</style>
