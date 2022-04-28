<template>
  <b-container fluid class="rmk-patient-form">
    <!-- alert start -->
    <div class="container-fluid" style="position:absolute;">
      <div class="row justify-content-md-center">
        <div
          class="col-lg-10 col-md-10 col-sm-10 col-xl-10 alert alert-danger text-center p-1"
          style="z-index: 5;"
          v-if="$store.state.errors != ''"
        >
          <button
            type="button"
            aria-hidden="true"
            class="close"
            @click="$store.state.errors = ''"
          >
            ×
          </button>
          <p>
            <i class="fas fa-exclamation-triangle"></i>&nbsp;
            {{ $t("Хатолик") }}
          </p>
          <p class="text-center">{{ $store.state.errors }}</p>
        </div>
      </div>
    </div>
    <!-- alert end -->

    <!-- button group start -->
    <b-row class="justify-content-md-center">
      <b-col sm="5" md="5" lg="5" xl="5">
        <b-button
          v-if="
            role === $store.state.REGISTRATION ||
              role === $store.state.DOCTOR ||
              role === $store.state.ITMED
          "
          style="color: #fff;"
          variant="primary"
          @click="PatientHistory()"
          :disabled="history"
        >
          <b-spinner small v-if="history"></b-spinner>
          <b-iconstack>
            <b-icon
              stacked
              icon="list-check"
              scale="0.60"
              shift-v="-1"
            ></b-icon>
            <b-icon stacked icon="clipboard"></b-icon>
          </b-iconstack>
          {{ $t("Касаллик Тирихи") }}
        </b-button>
      </b-col>
      <b-col sm="2" md="2" lg="2" xl="2" class="text-center">
        <b-form-checkbox
          v-if="
            role === $store.state.REGISTRATION ||
              role === $store.state.DOCTOR ||
              role === $store.state.ITMED
          "
          id="doc_status"
          v-model="data.status"
          name="doc_status"
          class="mt-2"
          value="complete"
          unchecked-value="waiting"
        >
          {{ $t("Тугатиш") }}
        </b-form-checkbox>
      </b-col>
      <b-col sm="5" md="5" lg="5" xl="5">
        <b-button
          style="color: #fff; float:right;"
          variant="danger"
          :to="{ path: '/archive/index' }"
          size="sm"
        >
          <b-icon icon="x"></b-icon>
        </b-button>
      </b-col>
    </b-row>
    <!-- button group end -->

    <!-- document datas start -->
    <b-row class="rmk-card">
      <b-col sm="4" md="4" lg="4" xl="4">
        <label for="patient" class="rmk-label">{{ $t("Бемор") }}</label>
        <b-card no-body>
          <b-input-group>
            <b-form-input
              id="patient"
              type="text"
              v-model="data.patient_name"
              :placeholder="$t('Беморни танланг...')"
              class="form-control px-1"
            ></b-form-input>
          </b-input-group>
        </b-card>
      </b-col>
      <b-col sm="4" md="4" lg="4" xl="4">
        <label for="operator" class="rmk-label">{{ $t("Оператор") }}</label>
        <b-card no-body>
          <v-select
            id="operator"
            :clearable="true"
            :options="operators"
            v-model="data.user_id"
            :reduce="username => username.id"
            label="username"
            disabled
          >
          </v-select>
        </b-card>
      </b-col>
      <b-col sm="4" md="4" lg="4" xl="4">
        <label for="type_service" class="rmk-label">{{
          $t("Хизмат Тури")
        }}</label>
        <b-card no-body>
          <v-select
            id="type_service"
            :clearable="true"
            :options="typeServices"
            v-model="data.type_service"
            :reduce="label => label.name"
            label="label"
          >
          </v-select>
        </b-card>
      </b-col>
    </b-row>
    <!-- document datas end -->

    <!-- navbar start -->
    <b-container fluid class="mt-1">
      <b-card no-body style="height:73vh;">
        <b-tabs v-model="tabIndex" card> 
          <!-- patient datas start -->
          <b-tab
            :title="$t('Бемор маълумотлари')"
            :title-link-class="linkClass(0)"
            class="py-1"
          >
            <b-card-text>
              <b-container fluid>
                <b-row>
                  <!-- patient lastname start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-0">
                    <label class="mb-0" for="input-lastname"
                      >{{ $t("Фамилия")
                      }}<sup class="text-danger">*</sup></label
                    >
                    <b-form-input
                      id="input-lastname"
                      type="text"
                      v-model="patient_datas.lastname"
                      :placeholder="$t('Фамилияни тўлдиринг')"
                      class="form-control"
                    ></b-form-input>
                  </b-col>
                  <!-- patient lastname end -->

                  <!-- patient name start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-0">
                    <label class="mb-0" for="input-name"
                      >{{ $t("Исм") }}<sup class="text-danger">*</sup></label
                    >
                    <b-form-input
                      id="input-name"
                      type="text"
                      v-model="patient_datas.name"
                      :placeholder="$t('Исмни тўлдиринг')"
                      class="form-control"
                    ></b-form-input>
                  </b-col>
                  <!-- patient name end -->

                  <!-- patient patronymic start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="input-patronymic"
                      >{{ $t("Отасини Исми")
                      }}<sup class="text-danger">*</sup></label
                    >
                    <b-form-input
                      id="input-patronymic"
                      type="text"
                      v-model="patient_datas.patronymic"
                      :placeholder="$t('Отасини Исмини тўлдиринг')"
                      class="form-control"
                    ></b-form-input>
                  </b-col>
                  <!-- patient patronymic end -->

                  <!-- patient region start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="region">{{ $t("Вилоят") }}</label>
                    <v-select
                      id="region"
                      :clearable="true"
                      :options="regions"
                      v-model="patient_datas.region_id"
                      :reduce="name => name.id"
                      label="name"
                      :placeholder="$t('Вилоятни танланг...')"
                      @input="GetDistricts()"
                    >
                    </v-select>
                  </b-col>
                  <!-- patient region end -->

                  <!-- patient birthday start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="input-date">{{
                      $t("Туғилган сана")
                    }}</label
                    ><br />
                    <date-picker
                      id="input-date"
                      v-model="patient_datas.birthday"
                      format="DD.MM.YYYY"
                      value-type="X"
                      style="width: 100%"
                      type="date"
                      :lang="lang"
                      :placeholder="$t('Туғилган санани танланг...')"
                    ></date-picker>
                  </b-col>
                  <!-- patient birthday end -->

                  <!-- patient district start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="district">{{ $t("Туман") }}</label>
                    <v-select
                      id="district"
                      :clearable="true"
                      :options="districts"
                      v-model="patient_datas.district_id"
                      :reduce="name => name.id"
                      label="name"
                      :placeholder="$t('Туманни танланг...')"
                      @input="GetNeighboarhood()"
                    >
                    </v-select>
                  </b-col>
                  <!-- patient district end -->

                  <!-- patient gender start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <p class="m-0 p-0">{{ $t("Жинси") }}</p>
                    <md-radio
                      class="my-1"
                      v-model="patient_datas.gender"
                      value="male"
                      >{{ $t("Эркак") }}</md-radio
                    >
                    <md-radio
                      class="my-1"
                      v-model="patient_datas.gender"
                      value="female"
                      >{{ $t("Аёл") }}</md-radio
                    >
                  </b-col>
                  <!-- patient gender end -->

                  <!-- patient neighboarhood start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="neighboarhood">{{
                      $t("МФЙ")
                    }}</label>
                    <v-select
                      id="neighboarhood"
                      :clearable="true"
                      :options="neighboarhoods"
                      v-model="patient_datas.neighboarhood_id"
                      :reduce="name => name.id"
                      label="name"
                      :placeholder="$t('МФЙни танланг...')"
                    >
                    </v-select>
                  </b-col>
                  <!-- patient neighboarhood end -->

                  <!-- patient phone and passport start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <b-row>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <label class="mb-0" for="input-phone">{{
                          $t("Телефон")
                        }}</label>
                        <b-form-input
                          id="input-phone"
                          v-model="patient_datas.phone"
                          placeholder="+998xxxxxxx"
                          type="tel"
                          class="form-control"
                        ></b-form-input>
                      </b-col>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <label class="mb-0" for="input-passport"
                          >Паспорт серия</label
                        >
                        <b-form-input
                          id="input-passport"
                          type="text"
                          v-model="patient_datas.passport"
                          placeholder="AA1234567"
                          class="form-control"
                        ></b-form-input>
                      </b-col>
                    </b-row>
                  </b-col>
                  <!-- patient phone and passport end -->

                  <!-- patient address start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="input-address">{{
                      $t("Уй")
                    }}</label>
                    <b-form-input
                      id="input-address"
                      type="text"
                      v-model="patient_datas.address"
                      :placeholder="$t('Уйни тўлдиринг')"
                      class="form-control"
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
                          v-model="patient_datas.d_control"
                          class="mt-2"
                        >
                          {{ $t("Д-назорат") }}
                        </b-form-checkbox>
                      </b-col>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <b-form-checkbox
                          id="disability"
                          name="disability"
                          v-model="patient_datas.disability"
                          class="mt-2"
                        >
                          {{ $t("Ногиронлиги") }}
                        </b-form-checkbox>
                      </b-col>
                    </b-row>
                  </b-col>
                  <!-- patient d_control and disability end -->

                  <!-- patient height and weight start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1 m-0">
                    <b-row>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <label class="mb-0" for="input-height">{{
                          $t("Бўйи")
                        }}</label>
                        <b-form-input
                          id="input-height"
                          type="text"
                          v-model="data.height"
                          :placeholder="$t('Бўйини тўлдиринг')"
                          class="form-control"
                        ></b-form-input>
                      </b-col>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <label class="mb-0" for="input-weight">{{
                          $t("Оғирлиги")
                        }}</label>
                        <b-form-input
                          id="input-weight"
                          type="text"
                          v-model="data.weight"
                          :placeholder="$t('Оғирлигини тўлдиринг')"
                          class="form-control"
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
            :title="$t('Шифокор кўриги')"
            :title-link-class="linkClass(1)"
            class="pt-2"
            v-if="
              role === $store.state.REGISTRATION ||
                role === $store.state.DOCTOR ||
                role === $store.state.ITMED
            "
          >
            <b-card-text>
              <b-container fluid class="p-0">
                <b-row>
                  <!-- complaint input start -->
                  <b-col sm="12" md="12" lg="12" xl="12">
                    <label for="input-complaint" class="m-0">{{
                      $t("Бемор Шикояти")
                    }}</label>
                    <b-form-input
                      id="input-complaint"
                      type="text"
                      v-model="data.complaint"
                      class="form-control rmk-input px-1"
                    ></b-form-input>
                  </b-col>
                  <!-- complaint input end -->
                </b-row>
              </b-container>
              <!-- table start -->
              <b-container
                v-if="data.doctor.length > 0"
                fluid
                style="height: 51vh; overflow-y: auto;"
              >
                <table
                  class="table table-bordered table-striped table-hover table-bordered table-sm mt-2"
                >
                  <thead>
                    <tr class="table-primary">
                      <th>#</th>
                      <th>{{ $t("Шифокор") }}</th>
                      <th>{{ $t("Бўлим") }}</th>
                      <th>{{ $t("Хона Рақами") }}</th>
                      <th>{{ $t("Филиал") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in data.doctor" :key="index">
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
            :title="$t('Текширувлар')"
            :title-link-class="linkClass(2)"
            class="pt-2"
          >
            <b-card-text>
              <!-- inspections table start -->
              <b-tabs
                v-model="tableIndex"
                card
                v-if="data.inspection.length > 0"
              >
                <b-tab
                  v-for="(item, index) in data.inspection"
                  :key="index"
                  :title="item.name ? item.name : item.inspection.name"
                  :title-link-class="link_Class(index)"
                  active
                  class="py-1"
                >
                  <b-card-text>
                    <h5 class="text-center m-0">
                      {{ item.name ? item.name : item.inspection.name }} &emsp;
                    </h5>
                    <!-- table start -->
                    <b-container
                      fluid
                      style="height: 42vh; overflow-y: auto; margin: 0;"
                    >
                      <table
                        class="table table-bordered table-striped table-hover table-bordered table-sm"
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
                              {{ $t("Танлаш") }}
                            </th>
                            <th>{{ $t("Анализ") }}</th>
                            <th>{{ $t("Натижа") }}</th>
                            <th style="width: 100px;">{{ $t("Расм") }}</th>
                            <th>{{ $t("Норма") }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(field, indeks) in item.child"
                            :key="indeks"
                          >
                            <th style="width: 30px;">{{ indeks + 1 }}</th>
                            <td
                              v-if="
                                item.type != null
                                  ? item.type
                                  : item.inspection.type == true
                              "
                            >
                              <input type="checkbox" v-model="field.checked" />
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
                                :readonly="item.user_id != ins_user_id"
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
                        :title="$t('Расм')"
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
          <b-tab
            :title="$t('Ташхис')"
            :title-link-class="linkClass(3)"
            class="pt-2"
            v-if="role === $store.state.DOCTOR || role === $store.state.ITMED"
          >
            <b-tabs v-model="tabDoctorIndex" card v-if="data.doctor.length > 0">
              <b-tab
                v-for="(item, index) in data.doctor"
                :key="index"
                :title="item.doctor.name != null ? item.doctor.name : ''"
                :title-link-class="linkDoctorClass(index)"
                class="py-0"
              >
                <b-container fluid style="height: 53vh; overflow-y: auto;">
                  <b-row>
                    <!-- diagnosis fields start -->
                    <b-col
                      offset-sm="1"
                      sm="11"
                      offset-md="1"
                      md="11"
                      offset-lg="1"
                      lg="11"
                      offset-xl="1"
                      xl="11"
                    >
                      <label
                        for="textarea-illness-history"
                        class="rmk-label-doctor mt-1"
                        >{{ $t("Касаллик тарихи(Анамнез)") }}</label
                      >
                      <b-form-textarea
                        id="textarea-illness-history"
                        rows="3"
                        v-model="item.medical_history"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
                      ></b-form-textarea>
                    </b-col>
                    <b-col
                      offset-sm="1"
                      sm="11"
                      offset-md="1"
                      md="11"
                      offset-lg="1"
                      lg="11"
                      offset-xl="1"
                      xl="11"
                    >
                      <label
                        for="textarea-complaint"
                        class="rmk-label-doctor"
                        >{{ $t("Бемор Шикояти") }}</label
                      >
                      <b-form-textarea
                        id="textarea-complaint"
                        rows="3"
                        v-model="item.complaint"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
                      ></b-form-textarea>
                    </b-col>
                    <b-col
                      offset-sm="1"
                      sm="11"
                      offset-md="1"
                      md="11"
                      offset-lg="1"
                      lg="11"
                      offset-xl="1"
                      xl="11"
                    >
                      <label
                        for="textarea-objective-survey"
                        class="rmk-label-doctor"
                        >{{ $t("Объектив кўрув") }}</label
                      >
                      <b-form-textarea
                        id="textarea-objective-survey"
                        rows="3"
                        v-model="item.objective_vision"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
                      ></b-form-textarea>
                    </b-col>
                    <b-col
                      offset-sm="1"
                      sm="11"
                      offset-md="1"
                      md="11"
                      offset-lg="1"
                      lg="11"
                      offset-xl="1"
                      xl="11"
                    >
                      <label
                        for="textarea-labaratory-entry"
                        class="rmk-label-doctor"
                        >{{ $t("Инструментал текшириш") }}</label
                      >
                      <b-form-textarea
                        id="textarea-labaratory-entry"
                        rows="3"
                        v-model="item.instrumental"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
                      ></b-form-textarea>
                    </b-col>
                    <b-col
                      offset-sm="1"
                      sm="11"
                      offset-md="1"
                      md="11"
                      offset-lg="1"
                      lg="11"
                      offset-xl="1"
                      xl="11"
                    >
                      <label
                        for="textarea-main-diagnosis"
                        class="rmk-label-doctor"
                        >{{ $t("Aсосий ташхис") }}
                        <b-button
                          variant="light"
                          size="sm"
                          class="p-0"
                          style="color: #3c8dbc"
                          :disabled="item.doctor.id !== doctor_id"
                          >МКБ-10</b-button
                        >
                      </label>
                      <b-form-textarea
                        id="textarea-main-diagnosis"
                        rows="3"
                        v-model="item.diagnos"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
                      ></b-form-textarea>
                      <div class="mkb-input" v-if="item.diagnostics.length > 0">
                        <span
                          class="mkb-name"
                          v-for="(el, i) in item.diagnostics"
                          :key="i"
                          >{{ el.diagnos != null ? el.diagnos.name : "" }}
                          <span
                            class="badge badge-danger"
                            style="cursor:pointer"
                            >×
                          </span>
                        </span>
                      </div>
                    </b-col>
                    <b-col
                      offset-sm="1"
                      sm="11"
                      offset-md="1"
                      md="11"
                      offset-lg="1"
                      lg="11"
                      offset-xl="1"
                      xl="11"
                    >
                      <label
                        for="textarea-concomitant"
                        class="rmk-label-doctor"
                        >{{ $t("Хамрох диагноз") }}</label
                      >
                      <b-form-textarea
                        id="textarea-concomitant"
                        rows="3"
                        v-model="item.concomitant"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
                      ></b-form-textarea>
                    </b-col>
                    <b-col
                      offset-sm="1"
                      sm="11"
                      offset-md="1"
                      md="11"
                      offset-lg="1"
                      lg="11"
                      offset-xl="1"
                      xl="11"
                    >
                      <label
                        for="textarea-procedure"
                        class="rmk-label-doctor"
                        >{{ $t("Даволаш") }}</label
                      >
                      <b-form-textarea
                        id="textarea-procedure"
                        rows="3"
                        v-model="item.procedure"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
                      ></b-form-textarea>
                    </b-col>
                    <b-col
                      offset-sm="1"
                      sm="11"
                      offset-md="1"
                      md="11"
                      offset-lg="1"
                      lg="11"
                      offset-xl="1"
                      xl="11"
                    >
                      <label
                        for="textarea-recommended"
                        class="rmk-label-doctor"
                        >{{ $t("Тавсия") }}</label
                      >
                      <b-form-textarea
                        id="textarea-recommended"
                        rows="3"
                        v-model="item.recommended"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
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
          <b-tab
            :title="$t('Рецепт')"
            :title-link-class="linkClass(4)"
            class="py-1"
            v-if="role === $store.state.DOCTOR || role === $store.state.ITMED"
          >
            <b-tabs v-model="tabRecipeIndex" card v-if="data.doctor.length > 0">
              <b-tab
                v-for="(item, index) in data.doctor"
                :key="index"
                :title="item.doctor.name != null ? item.doctor.name : ''"
                :title-link-class="linkRecipeClass(index)"
                class="py-1"
              >
                <b-container fluid style="height: 47vh; overflow-y: auto;">
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12">
                      <table
                        class="table table-hover table-striped table-bordered table-sm"
                      >
                        <thead>
                          <tr class="table-primary">
                            <th>
                              #
                            </th>
                            <th style="width:400px">{{ $t("Дори") }}</th>
                            <th>{{ $t("Кун") }}</th>
                            <th>{{ $t("Маҳал") }}</th>
                            <th>{{ $t("Қўшимчалар") }}</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item2, index2) in item.reciept"
                            :key="index2"
                          >
                            <th>{{ index2 + 1 }}</th>
                            <td>
                              <v-select
                                :clearable="true"
                                :options="drugs"
                                v-model="item2.pill_id"
                                :reduce="name => name.id"
                                :placeholder="$t('Танланг...')"
                                label="name"
                                :disabled="item.doctor.id !== doctor_id"
                              >
                              </v-select>
                            </td>
                            <td>
                              <input
                                class="form-control form-control-sm"
                                type="number"
                                v-model="item2.day"
                                :disabled="item.doctor.id !== doctor_id"
                              />
                            </td>
                            <td>
                              <input
                                class="form-control form-control-sm"
                                type="number"
                                v-model="item2.time"
                                :disabled="item.doctor.id !== doctor_id"
                              />
                            </td>
                            <td>
                              <input
                                class="form-control form-control-sm"
                                type="text"
                                v-model="item2.comment"
                                :disabled="item.doctor.id !== doctor_id"
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
            :title="$t('Ташхис Файллар')"
            :title-link-class="linkClass(5)"
            class="pt-1"
            v-if="
              role === $store.state.DOCTOR ||
                role === $store.state.ITMED ||
                role === $store.state.REGISTRATION
            "
          >
            <b-container
              fluid
              v-if="data.files.length > 0"
              style="height: 60vh; overflow-y: auto;"
            >
              <b-row>
                <b-col sm="12" md="12" lg="12" xl="12">
                  <table
                    class="table table-hover table-striped table-bordered table-sm"
                  >
                    <thead>
                      <tr class="table-primary">
                        <th>#</th>
                        <th>{{ $t("Файллар") }}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in data.files" :key="index">
                        <th>{{ index + 1 }}</th>
                        <td>{{ item.href }}</td>
                        <td>
                          <a
                            :href="
                              `${axios.defaults.baseURL}upload/` + item.href
                            "
                            target="_blank"
                            class="btn btn-info btn-sm text-white"
                            ><i class="fas fa-eye"></i>&ensp;{{
                              $t("Кўриш")
                            }}</a
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
          <!-- print section start -->
          <b-tab
            :title="$t('Печат')"
            :title-link-class="linkClass(6)"
            v-if="
              role === $store.state.DOCTOR ||
                role === $store.state.ITMED ||
                role === $store.state.LABARATORY
            "
          >
            <b-card-text>
              <b-row class="justify-content-md-center">
                <b-col sm="2" md="2" lg="2" xl="2">
                  <b-button
                    variant="primary"
                    @click="DischargePatient()"
                    :disabled="discharge"
                    block
                  >
                    <b-spinner small v-if="discharge"></b-spinner>
                    <b-icon icon="printer-fill"></b-icon>
                    Выписка
                  </b-button>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2">
                  <b-button
                    variant="primary"
                    @click="ExamPatient()"
                    block
                  >
                    <b-icon icon="printer-fill"></b-icon>
                    Осмотр
                  </b-button>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2">
                  <b-button
                    variant="primary"
                    @click="Xray()"
                    :disabled="xray"
                    block
                  >
                    <b-spinner small v-if="xray"></b-spinner>
                    <b-icon icon="ui-checks"></b-icon>
                    УЗИ
                  </b-button>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2">
                  <b-button
                    variant="primary"
                    @click="InspectionPrint()"
                    :disabled="inpectionprint"
                    block
                  >
                    <b-spinner small v-if="inpectionprint"></b-spinner>
                    <b-icon icon="card-list"></b-icon>
                    Текширувлар
                  </b-button>
                </b-col>
              </b-row>
            </b-card-text>
          </b-tab>
          <!-- print section end -->
        </b-tabs>
      </b-card>
    </b-container>
    <!-- navbar end -->
  </b-container>
</template>
<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import moment from "moment";
export default {
  components: { DatePicker },
  data: () => ({
    registration_id: 0,
    role: null,
    patient_datas: {
      fullname: null,
      name: null,
      lastname: null,
      patronymic: null,
      d_control: false,
      phone: null,
      birthday: null,
      gender: null,
      passport: null,
      region_id: null,
      district_id: null,
      neighboarhood_id: null,
      address: null,
      disability: false
    },
    data: {
      patient_id: null,
      patient_name: null,
      height: null,
      weight: null,
      user_id: parseInt(localStorage.getItem("oid")),
      branch_id: parseInt(localStorage.getItem("branch_id")),
      type_service: "ambulator",
      created_at: null,
      updated_at: null,
      status: "waiting",
      complaint: null,
      inspection: [],
      doctor: [],
      files: [],
      room: []
    },
    lang: {
      formatLocale: {
        firstDayOfWeek: 1
      },
      monthBeforeYear: false
    },
    doctor_id: parseInt(localStorage.getItem("did")),
    branch_id: parseInt(localStorage.getItem("branch_id")),
    ins_user_id: parseInt(localStorage.getItem("oid")),
    tabIndex: 0,
    tableIndex: 0,
    tabDoctorIndex: 0,
    tabRecipeIndex: 0,
    operators: [],
    typeServices: [
      { name: "ambulator", label: "Амбулатор" },
      { name: "statsionar", label: "Стационар" }
    ],
    regions: [],
    districts: [],
    neighboarhoods: [],
    branches: [],
    images: [],
    drugs: [],
    history: false,
    modalImageShow: false,
    modalImage: null,
    discharge: false,
    xray: false,
    inpectionprint: false
  }),
  async mounted() {
    let self = this;
    self.role = localStorage.getItem("role");
    await self.GetOperators();
    await self.GetRegions();
    await self.GetBranches();

    //update patient => bemorni tahrirlash
    if (self.$route.path != "/patient/create") {
      try {
        const response = await self.axios.get(
          "api/registration_history/id/" + self.$route.params.id
        );
        self.data = response.data;
        self.patient_datas = response.data.patient;
        self.data.patient_name = response.data.patient.fullname;
        self.patient_datas.birthday = response.data.patient.birthday
          ? response.data.patient.birthday.toString()
          : null;
        await self.GetDistricts();
        await self.GetNeighboarhood();
        await self.GetDrug();
      } catch (error) {
        self.$store.state.errors = error;
      }
    }
  },
  methods: {
    async GetOperators() {
      let self = this;
      //get list of operators => operatorlarni olish
      // let id = localStorage.getItem("branch_id");
      try {
        const response = await self.axios.get("api/user");
        self.operators = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    async GetDrug() {
      let self = this;
      //dorilar ro'yhatini olish
      try {
        const response = await self.axios.get("api/pill");
        self.drugs = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
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
        return ["bg-primary", "text-light"];
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
    PatientHistory() {
      let self = this;
      const route = self.$router.resolve({
        path: "/patient/history/" + self.data.patient_id
      });
      window.open(route.href, "_blank");
    },
    async GetRegions() {
      let self = this;
      //get list of regions => viloyatlar ro'yhatinini olish
      try {
        const response = await self.axios.get("api/region");
        self.regions = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    async GetDistricts() {
      let self = this;
      //get list of districts => tumanlar ro'yhatinini olish
      if (self.patient_datas.region_id != null) {
        try {
          const response = await self.axios.get(
            "api/district/region/" + self.patient_datas.region_id
          );
          self.districts = response.data;
        } catch (error) {
          self.$store.state.errors = error;
        }
      }
    },
    async GetNeighboarhood() {
      let self = this;
      //get list of neighboarhoods => mahallalar ro'yhatini olish
      if (self.patient_datas.district_id != null) {
        try {
          const response = await self.axios.get(
            "api/neighboarhood/district/" + self.patient_datas.district_id
          );
          self.neighboarhoods = response.data;
        } catch (error) {
          self.$store.state.errors = error;
        }
      }
    },
    async GetBranches() {
      let self = this;
      //get list of branches => filiallar ro'yhatinini olish
      try {
        const response = await self.axios.get("api/branch");
        self.branches = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    ShowImage(image) {
      this.modalImage = image;
    },
    DischargePatient() {
      let self = this;
      var doctor = [];
      let title = "Амбулатор шифокор текшируви";
      self.data.doctor.forEach(element => {
        if (element.doctor_id == self.doctor_id) {
          doctor = element;
        }
      });
      localStorage.setItem("patient", JSON.stringify(self.patient_datas));
      localStorage.setItem("doctor", JSON.stringify(doctor));
      localStorage.setItem("title", JSON.stringify(title));
      localStorage.setItem("created_at", JSON.stringify(self.data.created_at));
      localStorage.setItem("updated_at", JSON.stringify(self.data.updated_at));
      const route = self.$router.resolve({
        path: "/patient/dischargepatient"
      });
      window.open(route.href, "_blank");
    },
    ExamPatient() {
      let self = this;
      var doctor = [];
      let title = "Шифокор текшируви";
      self.data.doctor.forEach(element => {
        if (element.doctor_id == self.doctor_id) {
          doctor = element;
        }
      });
      localStorage.setItem("patient", JSON.stringify(self.patient_datas));
      localStorage.setItem("doctor", JSON.stringify(doctor));
      localStorage.setItem("title", JSON.stringify(title));
      localStorage.setItem("created_at", JSON.stringify(self.data.created_at));
      localStorage.setItem("updated_at", JSON.stringify(self.data.updated_at));
      const route = self.$router.resolve({
        path: "/patient/dischargepatient"
      });
      window.open(route.href, "_blank");
    },
    Xray() {
      let self = this;
      var inspection = [];
      var branch = self.branches.find(x => x.id == self.branch_id);
      self.data.inspection.forEach(element => {
        if (element.user_id == self.ins_user_id) {
          inspection.push({...element});
        }
      });
      localStorage.setItem("patient", JSON.stringify(self.patient_datas));
      localStorage.setItem("inspection", JSON.stringify(inspection));
      localStorage.setItem("branch", JSON.stringify(branch));
      localStorage.setItem("created_at", JSON.stringify(self.data.created_at));
      localStorage.setItem("updated_at", JSON.stringify(self.data.updated_at));
      const route = self.$router.resolve({
        path: "/patient/xray"
      });
      window.open(route.href, "_blank");
    },
    InspectionPrint() {
      let self = this;
      var inspection = [];
      var branch = self.branches.find(x => x.id == self.branch_id);
      self.data.inspection.forEach(element => {
        if (element.user_id == self.ins_user_id) {
          inspection.push({...element});
        }
      });
      localStorage.setItem("patient", JSON.stringify(self.patient_datas));
      localStorage.setItem("inspection", JSON.stringify(inspection));
      localStorage.setItem("branch", JSON.stringify(branch));
      localStorage.setItem("created_at", JSON.stringify(self.data.created_at));
      const route = self.$router.resolve({
        path: "/patient/inspection"
      });
      window.open(route.href, "_blank");
    }
  },
  filters: {
    moment: function(date) {
      return moment.unix(date).format("DD.MM.YYYY");
    }
  }
};
</script>
<style scoped>
.rmk-patient-form {
  width: 100%;
  background-color: #d1e5f1 !important;
  padding-top: 10px;
  margin: 0;
  height: 100vh;
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
  margin: 10px 1px;
  border-radius: 10px;
}
.rmk-label {
  color: #fff;
  font-size: 13pt;
}
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
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
.mkb-input {
  border: 1px solid #3c8dbc;
  width: 100%;
  height: auto;
  padding: 1px;
  margin-bottom: 5px;
}
.mkb-name {
  height: 5px;
  border: 1px solid #759daa;
  margin: 2px;
  padding: 1px;
  border-radius: 3px;
}
.change-lang {
  font-size: 18px;
  margin: 0 8px;
  cursor: pointer;
}
</style>
