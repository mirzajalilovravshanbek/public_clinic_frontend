<template>
  <!-- navbar start -->
  <b-container fluid class="rmk-patient-form">
    <b-button
      style="color: #fff; float:right;"
      variant="danger"
      @click="Close()"
      size="sm"
    >
      <b-icon icon="x"></b-icon>
    </b-button>
    <h2 class="text-center">{{ $t("Беморнинг Касаллик Тарихи") }}</h2>
    <div class="container-fluid" v-for="(doc, number) in docx" :key="number">
      <p>
        <span class="font-weight-bold">Ҳужжат Рақами:</span>
        № {{ doc.id }}
        <span class="float-right">
          <span class="font-weight-bold">Ҳужжат Сақланган Сана:</span>
          {{ doc.created_at | moment }}
        </span>
      </p>
      <b-card no-body style="height:520px;">
        <b-tabs v-model="tabIndex" card>
          <!-- patient datas start -->
          <b-tab
            title="Бемор маълумотлари"
            :title-link-class="linkClass(0)"
            class="pt-1"
          >
            <b-card-text>
              <b-container fluid>
                <b-row>
                  <!-- patient lastname start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-0">
                    <label class="mb-0" for="input-lastname"
                      >Фамилия<sup class="text-danger">*</sup></label
                    >
                    <b-form-input
                      id="input-lastname"
                      type="text"
                      v-model="doc.patient.lastname"
                      placeholder="Фамилияни тўлдиринг"
                      class="form-control"
                      disabled
                    ></b-form-input>
                  </b-col>
                  <!-- patient lastname end -->

                  <!-- patient name start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-0">
                    <label class="mb-0" for="input-name"
                      >Исм<sup class="text-danger">*</sup></label
                    >
                    <b-form-input
                      id="input-name"
                      type="text"
                      v-model="doc.patient.name"
                      placeholder="Исмни тўлдиринг"
                      class="form-control"
                      disabled
                    ></b-form-input>
                  </b-col>
                  <!-- patient name end -->

                  <!-- patient patronymic start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="input-patronymic"
                      >Отасини Исми<sup class="text-danger">*</sup></label
                    >
                    <b-form-input
                      id="input-patronymic"
                      type="text"
                      v-model="doc.patient.patronymic"
                      placeholder="Отасини Исмини тўлдиринг"
                      class="form-control"
                      disabled
                    ></b-form-input>
                  </b-col>
                  <!-- patient patronymic end -->

                  <!-- patient region start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="region">Вилоят</label>
                    <b-form-input
                      id="region"
                      type="text"
                      :value="
                        doc.patient.region != null
                          ? doc.patient.region.name
                          : ''
                      "
                      class="form-control"
                      disabled
                    ></b-form-input>
                  </b-col>
                  <!-- patient region end -->

                  <!-- patient birthday start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="input-date">Туғилган сана</label>
                    <b-form-input
                      id="input-date"
                      type="text"
                      :value="Birthday(doc.patient.birthday)"
                      class="form-control"
                      disabled
                    ></b-form-input>
                  </b-col>
                  <!-- patient birthday end -->

                  <!-- patient district start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="district">Туман</label>
                    <b-form-input
                      id="district"
                      type="text"
                      :value="
                        doc.patient.district != null
                          ? doc.patient.district.name
                          : ''
                      "
                      class="form-control"
                      disabled
                    ></b-form-input>
                  </b-col>
                  <!-- patient district end -->

                  <!-- patient gender start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <p class="m-0 p-0">Жинси</p>
                    <md-radio
                      class="my-1"
                      v-model="doc.patient.gender"
                      value="male"
                      disabled
                      >Эркак</md-radio
                    >
                    <md-radio
                      class="my-1"
                      v-model="doc.patient.gender"
                      value="female"
                      disabled
                      >Аёл</md-radio
                    >
                  </b-col>
                  <!-- patient gender end -->

                  <!-- patient neighboarhood start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="neighboarhood">МФЙ</label>
                    <b-form-input
                      id="neighboarhood"
                      type="text"
                      :value="
                        doc.patient.neighboarhood != null
                          ? doc.patient.neighboarhood.name
                          : ''
                      "
                      class="form-control"
                      disabled
                    ></b-form-input>
                  </b-col>
                  <!-- patient neighboarhood end -->

                  <!-- patient phone and passport start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <b-row>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <label class="mb-0" for="input-phone">Телефон</label>
                        <b-form-input
                          id="input-phone"
                          v-model="doc.patient.phone"
                          placeholder="+998xxxxxxx"
                          type="tel"
                          class="form-control"
                          disabled
                        ></b-form-input>
                      </b-col>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <label class="mb-0" for="input-passport"
                          >Паспорт серия</label
                        >
                        <b-form-input
                          id="input-passport"
                          type="text"
                          v-model="doc.patient.passport"
                          placeholder="AA1234567"
                          class="form-control"
                        ></b-form-input>
                      </b-col>
                    </b-row>
                  </b-col>
                  <!-- patient phone and passport end -->

                  <!-- patient address start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="input-address">Уй</label>
                    <b-form-input
                      id="input-address"
                      type="text"
                      v-model="doc.patient.address"
                      placeholder="Уйни тўлдиринг"
                      class="form-control"
                      disabled
                    ></b-form-input>
                  </b-col>
                  <!-- patient address end -->

                  <!-- patient d_control and disability start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <b-row>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <b-form-checkbox
                          id="d-control"
                          name="d-control"
                          v-model="doc.patient.d_control"
                          class="mt-2"
                          disabled
                        >
                          Д-назорат
                        </b-form-checkbox>
                      </b-col>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <b-form-checkbox
                          id="disability"
                          name="disability"
                          v-model="doc.patient.disability"
                          class="mt-2"
                          disabled
                        >
                          Ногиронлиги
                        </b-form-checkbox>
                      </b-col>
                    </b-row>
                  </b-col>
                  <!-- patient d_control and disability end -->

                  <!-- patient height and weight start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <b-row>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <label class="mb-0" for="input-height">Бўйи</label>
                        <b-form-input
                          id="input-height"
                          type="text"
                          v-model="doc.height"
                          placeholder="Бўйини тўлдиринг"
                          class="form-control"
                          disabled
                        ></b-form-input>
                      </b-col>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <label class="mb-0" for="input-weight">Оғирлиги</label>
                        <b-form-input
                          id="input-weight"
                          type="text"
                          v-model="doc.weight"
                          placeholder="Оғирлигини тўлдиринг"
                          class="form-control"
                          disabled
                        ></b-form-input>
                      </b-col>
                    </b-row>
                  </b-col>
                  <!-- patient height and weight end -->
                </b-row>
              </b-container>
            </b-card-text>
          </b-tab>
          <!-- patient datas end -->
          <!-- doctors section start -->
          <b-tab
            title="Шифокор кўриги"
            :title-link-class="linkClass(1)"
            class="pt-2"
          >
            <b-card-text>
              <b-container fluid class="p-0">
                <b-row>
                  <!-- complaint input start -->
                  <b-col sm="12" md="12" lg="12" xl="12">
                    <label for="input-complaint" class="m-0"
                      >Бемор Шикояти</label
                    >
                    <b-form-input
                      id="input-complaint"
                      type="text"
                      v-model="doc.complaint"
                      disabled
                      class="form-control rmk-input px-1"
                    ></b-form-input>
                  </b-col>
                  <!-- complaint input end -->
                </b-row>
              </b-container>
              <!-- table start -->
              <b-container
                v-if="doc.doctor.length > 0"
                fluid
                style="height: 400px; overflow-y: auto;"
              >
                <table
                  class="table table-bordered table-striped table-hover table-bordered table-sm mt-2"
                >
                  <thead>
                    <tr class="table-primary">
                      <th>#</th>
                      <th>Шифокор</th>
                      <th>Бўлим</th>
                      <th>Хона</th>
                      <th>Филиал</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in doc.doctor" :key="index">
                      <th>{{ index + 1 }}</th>
                      <td>
                        {{ item.doctor != null ? item.doctor.name : "" }}
                      </td>
                      <td>
                        {{
                          item.doctor.category != null
                            ? item.doctor.category.name
                            : ""
                        }}
                      </td>
                      <td>
                        {{
                          item.doctor.room != null
                            ? item.doctor.room.room.name
                            : ""
                        }}
                      </td>
                      <td>
                        {{
                          item.doctor.branch != null
                            ? item.doctor.branch.name
                            : ""
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </b-container>
              <!-- table end -->
            </b-card-text>
          </b-tab>
          <!-- doctors section end -->
          <!-- ispections start -->
          <b-tab
            title="Текширувлар"
            :title-link-class="linkClass(2)"
            class="pt-2"
          >
            <b-card-text>
              <!-- inspections table start -->
              <b-tabs card v-if="doc.inspection.length > 0">
                <b-tab
                  v-for="(item, index) in doc.inspection"
                  :key="index"
                  :title="item.name ? item.name : item.inspection.name"
                  :title-link-class="link_Class(index)"
                  class="pt-2"
                >
                  <b-card-text>
                    <h5 class="text-center m-0">
                      {{ item.name ? item.name : item.inspection.name }}
                    </h5>
                    <!-- table start -->
                    <b-container fluid style="height: 312px; overflow-y: auto;">
                      <table
                        class="table table-bordered table-striped table-hover table-bordered table-sm mt-1"
                      >
                        <thead>
                          <tr class="table-primary">
                            <th>#</th>
                            <th
                              v-if="
                                item.type != null
                                  ? item.type
                                  : item.inspection.type == true
                              "
                            >
                              Танлаш
                            </th>
                            <th>Анализ</th>
                            <th>Натижа</th>
                            <th style="width: 100px;">Расм</th>
                            <th>Норма</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(field, indeks) in item.child"
                            :key="indeks"
                          >
                            <th>{{ indeks + 1 }}</th>
                            <td
                              v-if="
                                item.type != null
                                  ? item.type
                                  : item.inspection.type == true
                              "
                            >
                              <input
                                type="checkbox"
                                v-model="field.checked"
                                disabled
                              />
                            </td>
                            <td>
                              {{ field.name ? field.name : "" }}
                            </td>
                            <td>
                              <b-form-textarea
                                rows="1"
                                max-rows="5"
                                v-model="field.text"
                                class="form-control"
                                disabled
                              ></b-form-textarea>
                            </td>
                            <td style="width: 100px; text-align:center">
                              <span v-if="field.file != ''">
                                <img
                                  :src="
                                    `${axios.defaults.baseURL}upload/` +
                                      field.file
                                  "
                                  style="width: 100px; cursor:pointer"
                                  @click="
                                    modalImageShow = !modalImageShow;
                                    ShowImage(field.file);
                                  "
                                />
                              </span>
                            </td>
                            <td>{{ field.norm }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <!-- image modal start -->
                      <b-modal
                        size="lg"
                        hide-footer
                        title="Расм"
                        v-model="modalImageShow"
                      >
                        <div class="text-center">
                          <img
                            :src="
                              `${axios.defaults.baseURL}upload/` + modalImage
                            "
                            style="width: 300px"
                          />
                        </div>
                      </b-modal>
                      <!-- image modal end -->
                    </b-container>
                    <!-- table end -->
                  </b-card-text>
                </b-tab>
              </b-tabs>
              <!-- inspections table end -->
            </b-card-text>
          </b-tab>
          <!-- ispections end -->
          <!-- diagnosis section start -->
          <b-tab title="Ташхис" :title-link-class="linkClass(3)" class="pt-2">
            <b-tabs card v-if="doc.doctor.length > 0">
              <b-tab
                v-for="(item, index) in doc.doctor"
                :key="index"
                :title="item.doctor != null ? item.doctor.name : ''"
                :title-link-class="linkDoctorClass(index)"
                class="pt-2"
              >
                <b-container fluid style="height: 385px; overflow-y: auto;">
                  <b-row>
                    <!-- diagnosis fields start -->
                    <b-col sm="12" md="12" lg="12" xl="12">
                      <label
                        for="textarea-illness-history"
                        class="rmk-label-doctor"
                        >Касаллик тарихи(Анамнез)</label
                      >
                      <b-form-textarea
                        id="textarea-illness-history"
                        rows="3"
                        v-model="item.medical_history"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        disabled
                      ></b-form-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12">
                      <label for="textarea-complaint" class="rmk-label-doctor"
                        >Бемор Шикояти</label
                      >
                      <b-form-textarea
                        id="textarea-complaint"
                        rows="3"
                        v-model="item.complaint"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        disabled
                      ></b-form-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12">
                      <label
                        for="textarea-objective-survey"
                        class="rmk-label-doctor"
                        >Объектив кўрув</label
                      >
                      <b-form-textarea
                        id="textarea-objective-survey"
                        rows="3"
                        v-model="item.objective_vision"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        disabled
                      ></b-form-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12">
                      <label
                        for="textarea-labaratory-entry"
                        class="rmk-label-doctor"
                        >Инструментал текшириш</label
                      >
                      <b-form-textarea
                        id="textarea-labaratory-entry"
                        rows="3"
                        v-model="item.instrumental"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        disabled
                      ></b-form-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12">
                      <label
                        for="textarea-main-diagnosis"
                        class="rmk-label-doctor"
                        >Aсосий ташхис
                        <b-button
                          variant="light"
                          size="sm"
                          class="p-0"
                          style="color: #3c8dbc"
                          disabled
                          >МКБ-10</b-button
                        >
                      </label>
                      <b-form-textarea
                        id="textarea-main-diagnosis"
                        rows="3"
                        v-model="item.diagnos"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        disabled
                      ></b-form-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12">
                      <label for="textarea-concomitant" class="rmk-label-doctor"
                        >Хамрох диагноз</label
                      >
                      <b-form-textarea
                        id="textarea-concomitant"
                        rows="3"
                        v-model="item.concomitant"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        disabled
                      ></b-form-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12">
                      <label for="textarea-procedure" class="rmk-label-doctor"
                        >Даволаш</label
                      >
                      <b-form-textarea
                        id="textarea-procedure"
                        rows="3"
                        v-model="item.procedure"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        disabled
                      ></b-form-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12">
                      <label for="textarea-recommended" class="rmk-label-doctor"
                        >Тавсия</label
                      >
                      <b-form-textarea
                        id="textarea-recommended"
                        rows="3"
                        v-model="item.recommended"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        disabled
                      ></b-form-textarea>
                    </b-col>
                    <!-- diagnosis fields end -->
                  </b-row>
                </b-container>
              </b-tab>
            </b-tabs>
          </b-tab>
          <!-- diagnosis section end -->
          <!-- recipe section start -->
          <b-tab title="Рецеп" :title-link-class="linkClass(4)" class="pt-1">
            <b-tabs card v-if="doc.doctor.length > 0">
              <b-tab
                v-for="(item, index) in doc.doctor"
                :key="index"
                :title="item.doctor.name != null ? item.doctor.name : ''"
                :title-link-class="linkRecipeClass(index)"
                class="pt-2"
              >
                <b-container fluid style="height: 335px; overflow-y: auto;">
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12">
                      <table
                        class="table table-hover table-striped table-bordered table-sm"
                      >
                        <thead>
                          <tr class="table-primary">
                            <th>#</th>
                            <th style="width:400px">Дори</th>
                            <th>Кун</th>
                            <th>Маҳал</th>
                            <th>Қўшимчалар</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item2, index2) in item.reciept"
                            :key="index2"
                          >
                            <th>{{ index2 + 1 }}</th>
                            <td>
                              <input
                                type="text"
                                :value="
                                  item2.pill != null ? item2.pill.name : ''
                                "
                                disabled
                                class="form-control form-control-sm px-1"
                              />
                            </td>
                            <td>
                              <input
                                class="form-control form-control-sm"
                                type="number"
                                v-model="item2.day"
                                disabled
                              />
                            </td>
                            <td>
                              <input
                                class="form-control form-control-sm"
                                type="number"
                                v-model="item2.time"
                                disabled
                              />
                            </td>
                            <td>
                              <input
                                class="form-control form-control-sm"
                                type="text"
                                v-model="item2.comment"
                                disabled
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </b-col>
                  </b-row>
                </b-container>
              </b-tab>
            </b-tabs>
          </b-tab>
          <!-- recipe section end -->
          <!-- tashxis section start -->
          <b-tab
            title="Ташхис Файллар"
            :title-link-class="linkClass(5)"
            class="pt-1"
          >
            <b-container fluid style="height: 450px; overflow-y: auto;">
              <b-row>
                <b-col sm="12" md="12" lg="12" xl="12">
                  <table
                    class="table table-hover table-striped table-bordered table-sm"
                  >
                    <thead>
                      <tr class="table-primary">
                        <th>#</th>
                        <th>Файллар</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in doc.files" :key="index">
                        <th>{{ index + 1 }}</th>
                        <td>{{ item.href }}</td>
                        <td>
                          <a
                            :src="
                              `${axios.defaults.baseURL}upload/` + item.href
                            "
                            target="_blank"
                            class="btn btn-info btn-sm text-white"
                            ><i class="fas fa-eye"></i>&ensp;Кўриш</a
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </b-col>
              </b-row>
            </b-container>
          </b-tab>
          <!-- tashxis section end -->
        </b-tabs>
      </b-card>
      <hr />
    </div>
  </b-container>
  <!-- navbar end -->
</template>
<script>
import moment from "moment";
export default {
  data: () => ({
    docx: [],
    lang: {
      formatLocale: {
        firstDayOfWeek: 1
      },
      monthBeforeYear: false
    },
    tabIndex: 0,
    tableIndex: 0,
    tabDoctorIndex: 0,
    tabRecipeIndex: 0,
    modalImageShow: false,
    modalImage: null
  }),
  async mounted() {
    let self = this;
    try {
      const response = await self.axios.get(
        "api/registration_history/patient/" + self.$route.params.id
      );
      self.docx = response.data;
    } catch (error) {}
  },
  methods: {
    Birthday(date) {
      if (date != null) {
        return moment.unix(date).format("DD.MM.YYYY");
      } else {
        return "";
      }
    },
    Close() {
      window.close();
    },
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ["bg-primary", "text-light"];
      } else {
        return ["bg-light", "text-info"];
      }
    },
    link_Class(idx) {
      if (this.tableIndex === idx) {
        return ["bg-light", "text-info"];
      } else {
        return ["bg-light", "text-info"];
      }
    },
    linkDoctorClass(idx) {
      if (this.tableDoctorIndex === idx) {
        return ["bg-primary", "text-light"];
      } else {
        return ["bg-light", "text-info"];
      }
    },
    linkRecipeClass(idx) {
      if (this.tableRecipeIndex === idx) {
        return ["bg-primary", "text-light"];
      } else {
        return ["bg-light", "text-info"];
      }
    },
    ShowImage(image) {
      this.modalImage = image;
    }
  },
  filters: {
    moment: function(date) {
      return moment.unix(date).format("DD.MM.YYYY HH:mm:ss");
    }
  }
};
</script>
<style scoped>
.rmk-patient-form {
  width: 100%;
  background-color: #d1e5f1 !important;
  padding: 8px 10px;
  margin: 0;
  height: 100%;
}
.rmk-close-button {
  float: right;
  position: absolute;
  right: 15px;
  top: 0px;
  text-decoration: none;
  font-size: 20pt;
}
.rmk-card {
  background-color: #3c8dbc;
  padding: 10px;
  margin: 8px 1px 0px 1px;
  border-radius: 10px;
}
.rmk-label {
  color: #fff;
  font-size: 13pt;
}
.rmk-label-doctor {
  display: block;
  background-color: #3c8dbc;
  color: #fff;
  padding: 3px 10px;
  border-radius: 5px;
  margin-bottom: 0;
}
.rmk-textarea {
  border: 1px solid #3c8dbc;
  margin-bottom: 5px;
}
.rmk-input {
  border: 1px solid #3c8dbc;
  border-radius: 3px;
}
</style>
