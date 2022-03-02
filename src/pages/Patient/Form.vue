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
          <p><i class="fas fa-exclamation-triangle"></i>&nbsp; Хатолик</p>
          <p class="text-center">{{ $store.state.errors }}</p>
        </div>
        <div
          class="col-lg-10 col-md-10 col-sm-10 col-xl-10 alert alert-success text-center p-1"
          style="z-index: 5;"
          v-if="checkPatientStatus"
        >
          <button
            type="button"
            aria-hidden="true"
            class="close"
            @click="checkPatientStatus = false"
          >
            ×
          </button>
          <p><i class="fas fa-check-circle"></i>&nbsp; Муваффақиятли</p>
          <p class="text-center">{{ PatientStatusText }}</p>
        </div>
      </div>
    </div>
    <!-- alert end -->

    <!-- button group start -->
    <b-row class="justify-content-md-center">
      <b-col sm="3" md="3" lg="3" xl="3">
        <b-button
          style="color: #fff;"
          variant="primary"
          @click="Save()"
          :disabled="saving"
        >
          <b-spinner small v-if="saving"></b-spinner>
          <b-icon icon="clipboard-plus"></b-icon>
          Сақлаш ва беркитиш
        </b-button>
      </b-col>
      <b-col sm="2" md="2" lg="2" xl="2">
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
          Касаллик Тирихи
        </b-button>
      </b-col>
      <b-col sm="1" md="1" lg="1" xl="1" class="text-center">
        <b-form-checkbox
          id="doc_status"
          v-model="data.status"
          name="doc_status"
          class="mt-2"
          value="completed"
          unchecked-value="waiting"
        >
          Тугатиш
        </b-form-checkbox>
      </b-col>
      <b-col sm="2" md="2" lg="2" xl="2" class="text-center">
        <b-button
          v-if="
            role === $store.state.REGISTRATION ||
              role === $store.state.DOCTOR ||
              role === $store.state.ITMED
          "
          style="color: #fff;"
          variant="primary"
          @click="print()"
          :disabled="printing"
        >
          <b-spinner small v-if="printing"></b-spinner>
          <b-icon icon="printer-fill"></b-icon>
          Печат
        </b-button>
      </b-col>
      <b-col sm="3" md="3" lg="3" xl="3" class="text-center">
        <div 
          v-if="
            role === $store.state.REGISTRATION ||
              role === $store.state.DOCTOR ||
              role === $store.state.ITMED
          "
        >
          <input
            type="file"
            style="display: none"
            id="files"
            ref="files"
            @change="onUploadTashxis()"
            class="my-0"
          />
          <button class="btn btn-primary" @click="$refs.files.click()">
            <b-icon icon="cloud-arrow-up-fill"></b-icon>&ensp;Ташхисларни юклаш
          </button>
          <span v-if="tashxisfile != ''"
            >&emsp;
            <b-icon icon="patch-check-fill" variant="success"></b-icon>
          </span>
        </div>
      </b-col>
      <b-col sm="1" md="1" lg="1" xl="1">
        <b-button
          style="color: #fff; float:right;"
          variant="danger"
          @click="Close()"
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
        <label for="patient" class="rmk-label">Бемор</label>
        <b-card no-body>
          <b-input-group
            @click="
              modalPatientShow = !modalPatientShow;
              GetPatient();
            "
          >
            <b-form-input
              id="patient"
              type="text"
              v-model="data.patient_name"
              placeholder="Беморни танланг..."
              class="form-control px-1"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                variant="primary"
                size="sm"
                style="color: #fff;"
                v-b-tooltip.hover.bottom.v-primary
                title="Бемор Танлаш"
                >...</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-card>
        <!-- modal patient search start -->
        <b-modal
          title="Беморни Қидириш"
          size="xl"
          hide-footer
          v-model="modalPatientShow"
          class="p-0"
        >
          <!-- User Interface controls -->
          <b-row class="mt-0">
            <b-col sm="6" md="6" lg="6" xl="6" class="my-1">
              <b-form-group
                label="Қидирув"
                label-for="filter-input"
                label-align-sm="left"
                label-size="sm"
                class="mb-0"
              >
                <b-input-group size="sm">
                  <b-form-input
                    id="filter-input"
                    v-model="filter"
                    type="search"
                    placeholder="Қидириш..."
                  ></b-form-input>

                  <b-input-group-append>
                    <b-button
                      variant="danger"
                      size="sm"
                      :disabled="!filter"
                      @click="filter = ''"
                      >Тозалаш</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="my-1">
              <b-form-group
                label="Ҳар бир сахифада"
                label-for="per-page-select"
                label-align-sm="left"
                label-size="sm"
                class="mb-0"
              >
                <b-form-select
                  id="per-page-select"
                  v-model="perPage"
                  :options="pageOptions"
                  size="sm"
                ></b-form-select>
              </b-form-group>
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                align="fill"
                size="sm"
                class="mt-2"
              ></b-pagination>
            </b-col>
          </b-row>
          <!-- Main table element start -->
          <b-table
            :items="patients"
            bordered
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :sort-desc.sync="sortDesc"
            stacked="md"
            hover
            show-empty
            small
            @row-clicked="AddPatient"
            @filtered="onFiltered"
            style="cursor:pointer"
          >
            <template #cell(name)="row">
              {{ row.value.fullname != null ? row.value.fullname : "" }}
              {{
                row.value.neighboarhood != null
                  ? row.value.neighboarhood.name
                  : ""
              }}
              {{ row.value.district != null ? row.value.district.name : "" }}
            </template>
          </b-table>
          <!-- Main table element end -->
        </b-modal>
        <!-- modal patient search end -->
      </b-col>
      <b-col sm="4" md="4" lg="4" xl="4">
        <label for="operator" class="rmk-label">Оператор</label>
        <b-card no-body>
          <v-select
            id="operator"
            :clearable="true"
            :options="operators"
            v-model="data.user_id"
            :reduce="username => username.id"
            label="username"
            @input="CheckOperator()"
            placeholder="Операторни танланг..."
          >
          </v-select>
        </b-card>
        <small style="color: red;" v-if="checkOperator"
          >"Оператор"ни танлаш шарт</small
        >
      </b-col>
      <b-col sm="4" md="4" lg="4" xl="4">
        <label for="type_service" class="rmk-label">Хизмат Тури</label>
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

    <!-- spinner start -->
    <div class="text-center" v-if="checkSpinner">
      <b-spinner
        variant="info"
        type="grow"
        style="margin-top:150px; margin-bottom: 278px; width: 4rem; height: 4rem;"
      ></b-spinner>
    </div>
    <!-- spinner end -->

    <!-- navbar start -->
    <b-container fluid class="mt-2" v-if="checkBody">
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
                      v-model="patient_datas.lastname"
                      placeholder="Фамилияни тўлдиринг"
                      class="form-control"
                      @blur="CheckLastName()"
                    ></b-form-input>
                    <small class="text-danger m-0" v-if="checkLastName"
                      >"Фамилия"ни тўлдириш шарт</small
                    >
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
                      v-model="patient_datas.name"
                      placeholder="Исмни тўлдиринг"
                      class="form-control"
                      @blur="CheckName()"
                    ></b-form-input>
                    <small class="text-danger m-0" v-if="checkName"
                      >"Исм"ни тўлдириш шарт</small
                    >
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
                      v-model="patient_datas.patronymic"
                      placeholder="Отасини Исмини тўлдиринг"
                      class="form-control"
                      @blur="CheckPatronymic()"
                    ></b-form-input>
                    <small class="text-danger m-0" v-if="checkPatronymic"
                      >"Отасини Исми"ни тўлдириш шарт</small
                    >
                  </b-col>
                  <!-- patient patronymic end -->

                  <!-- patient region start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="region">Вилоят</label>
                    <v-select
                      id="region"
                      :clearable="true"
                      :options="regions"
                      v-model="patient_datas.region_id"
                      :reduce="name => name.id"
                      label="name"
                      placeholder="Вилоятни танланг..."
                      @input="GetDistricts()"
                    >
                    </v-select>
                  </b-col>
                  <!-- patient region end -->

                  <!-- patient birthday start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="input-date">Туғилган сана</label
                    ><br />
                    <date-picker
                      id="input-date"
                      v-model="patient_datas.birthday"
                      format="DD.MM.YYYY"
                      value-type="X"
                      style="width: 100%"
                      type="date"
                      :lang="lang"
                      placeholder="Туғилган санани танланг..."
                    ></date-picker>
                  </b-col>
                  <!-- patient birthday end -->

                  <!-- patient district start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="district">Туман</label>
                    <v-select
                      id="district"
                      :clearable="true"
                      :options="districts"
                      v-model="patient_datas.district_id"
                      :reduce="name => name.id"
                      label="name"
                      placeholder="Туманни танланг..."
                      @input="GetNeighboarhood()"
                    >
                    </v-select>
                  </b-col>
                  <!-- patient district end -->

                  <!-- patient gender start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <p class="m-0 p-0">Жинси</p>
                    <md-radio
                      class="my-1"
                      v-model="patient_datas.gender"
                      value="male"
                      >Эркак</md-radio
                    >
                    <md-radio
                      class="my-1"
                      v-model="patient_datas.gender"
                      value="female"
                      >Аёл</md-radio
                    >
                  </b-col>
                  <!-- patient gender end -->

                  <!-- patient neighboarhood start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label class="mb-0" for="neighboarhood">МФЙ</label>
                    <v-select
                      id="neighboarhood"
                      :clearable="true"
                      :options="neighboarhoods"
                      v-model="patient_datas.neighboarhood_id"
                      :reduce="name => name.id"
                      label="name"
                      placeholder="МФЙни танланг..."
                    >
                    </v-select>
                  </b-col>
                  <!-- patient neighboarhood end -->

                  <!-- patient phone and passport start -->
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <b-row>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <label class="mb-0" for="input-phone">Телефон</label>
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
                    <label class="mb-0" for="input-address">Уй</label>
                    <b-form-input
                      id="input-address"
                      type="text"
                      v-model="patient_datas.address"
                      placeholder="Уйни тўлдиринг"
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
                          Д-назорат
                        </b-form-checkbox>
                      </b-col>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <b-form-checkbox
                          id="disability"
                          name="disability"
                          v-model="patient_datas.disability"
                          class="mt-2"
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
                          v-model="data.height"
                          placeholder="Бўйини тўлдиринг"
                          class="form-control"
                        ></b-form-input>
                      </b-col>
                      <b-col sm="6" md="6" lg="6" xl="6">
                        <label class="mb-0" for="input-weight">Оғирлиги</label>
                        <b-form-input
                          id="input-weight"
                          type="text"
                          v-model="data.weight"
                          placeholder="Оғирлигини тўлдиринг"
                          class="form-control"
                        ></b-form-input>
                      </b-col>
                    </b-row>
                  </b-col>
                  <!-- patient height and weight end -->

                  <!-- button start -->
                  <b-col
                    sm="6"
                    md="6"
                    lg="6"
                    xl="6"
                    class="pt-1"
                    v-if="
                      role === $store.state.REGISTRATION ||
                        role === $store.state.DOCTOR ||
                        role === $store.state.ITMED
                    "
                  >
                    <b-button
                      style="color: #fff;"
                      variant="primary"
                      class="mt-2"
                      @click="SavePatient()"
                      :disabled="patient_sending"
                    >
                      <b-spinner small v-if="patient_sending"></b-spinner>
                      <b-icon icon="clipboard-check"></b-icon>
                      Сақлаш
                    </b-button>
                  </b-col>
                  <!-- button end -->
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
            v-if="
              role === $store.state.REGISTRATION ||
                role === $store.state.DOCTOR ||
                role === $store.state.ITMED
            "
          >
            <b-card-text>
              <b-container fluid class="p-0">
                <b-row>
                  <!-- button start -->
                  <b-col sm="2" md="2" lg="2" xl="2">
                    <b-button
                      @click="
                        GetDoctors();
                        modalDoctorShow = !modalDoctorShow;
                      "
                      variant="primary"
                      class="mt-2"
                    >
                      <b-icon icon="person-lines-fill"></b-icon>
                      Шифокорлар
                    </b-button>
                  </b-col>
                  <!-- button end -->

                  <!-- complaint input start -->
                  <b-col sm="10" md="10" lg="10" xl="10">
                    <label for="input-complaint" class="m-0"
                      >Бемор Шикояти</label
                    >
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
              <!-- doctor list modal start -->
              <b-modal
                v-model="modalDoctorShow"
                title="Шифокорлар"
                size="lg"
                center="false"
                hide-footer
              >
                <p v-for="(item, index) in doctors" :key="index">
                  <a
                    v-b-toggle:my-collapse
                    :href="'#doctor-collapse-' + index"
                    @click.prevent
                  >
                    <b-icon icon="folder-minus" class="when-open"></b-icon>
                    <b-icon icon="folder-plus" class="when-closed"></b-icon>
                    {{ item.name }}
                  </a>
                  <b-collapse
                    :visible="index == 0 ? true : false"
                    :id="'doctor-collapse-' + index"
                  >
                    <table class="table table-bordered table-sm">
                      <tr>
                        <th>ФИШ</th>
                      </tr>
                      <tr
                        @click="AddDoctor(index, indexx)"
                        v-for="(itemm, indexx) in item.doctor"
                        :key="indexx"
                        style="cursor:pointer"
                      >
                        <td>{{ itemm.name }}</td>
                      </tr>
                    </table>
                  </b-collapse>
                </p>
              </b-modal>
              <!-- doctor list modal end -->
              <!-- table start -->
              <b-container
                v-if="data.doctor.length > 0"
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
                      <th></th>
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
                      <td class="text-center">
                        <b-icon
                          icon="trash"
                          style="cursor: pointer;"
                          variant="danger"
                          font-scale="1.2"
                          v-b-tooltip.hover.v-danger.right="'Шифокорни Ўчириш'"
                          @click="RemoveDoctor(index)"
                          v-if="
                            role === $store.state.REGISTRATION ||
                              role === $store.state.DOCTOR ||
                              role === $store.state.ITMED
                          "
                        ></b-icon>
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
              <b-button
                variant="primary"
                id="show-btn"
                @click="
                  GetInspectionsByBranch();
                  modalInspectionShow = !modalInspectionShow;
                "
                v-if="
                  role === $store.state.REGISTRATION ||
                    role === $store.state.DOCTOR ||
                    role === $store.state.ITMED
                "
              >
                <b-icon icon="journal-medical"></b-icon>
                Текширувлар
              </b-button>

              <!-- inspections modal start -->
              <b-modal
                v-model="modalInspectionShow"
                size="lg"
                hide-footer
                title="Текширувлар Рўйҳати"
              >
                <div class="d-block">
                  <!-- toggle link start -->
                  <p v-for="(item, index) in inspections" :key="index">
                    <a
                      v-b-toggle:my-collapse
                      :href="'#example-collapse-' + index"
                      @click.prevent
                    >
                      <b-icon icon="folder-minus" class="when-open"></b-icon>
                      <b-icon icon="folder-plus" class="when-closed"></b-icon>
                      {{ item.name }}
                    </a>

                    <b-collapse
                      :visible="index == 0 ? true : false"
                      :id="'example-collapse-' + index"
                    >
                      <table class="table table-bordered table-sm">
                        <tr>
                          <th>Номи</th>
                        </tr>
                        <tr
                          @click="AddInspectionList(index, indexx)"
                          v-for="(ins, indexx) in item.inspection"
                          :key="indexx"
                          style="cursor:pointer"
                        >
                          <td>{{ ins.name }}</td>
                        </tr>
                      </table>
                    </b-collapse>
                  </p>
                  <!-- toggle link end -->
                </div>
              </b-modal>
              <!-- inspections modal end -->

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
                  class="pt-2"
                >
                  <b-card-text>
                    <h5 class="text-center m-0">
                      {{ item.name ? item.name : item.inspection.name }} &emsp;
                      <b-icon
                        variant="danger"
                        icon="trash"
                        @click="RemoveIns(index)"
                        v-b-tooltip.hover.v-danger.top="'Текширувни Ўчириш'"
                        style="cursor:pointer"
                        v-if="
                          role === $store.state.REGISTRATION ||
                            role === $store.state.DOCTOR ||
                            role === $store.state.ITMED
                        "
                      ></b-icon>
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
                                @change="
                                  CheckStatusInspection(item.user_id, index, indeks)
                                "
                              ></b-form-textarea>
                            </td>
                            <td style="width: 100px; text-align:center">
                              <input
                                :id="'ins_' + index + '_files_' + indeks"
                                type="file"
                                @change="onInsUpload(indeks, index); CheckStatusInspection(item.user_id, index, indeks)"
                              />
                              <span v-if="field.file != ''">
                                <img
                                  :src="`${axios.defaults.baseURL}upload/`+ field.file"
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
                            :src="`${axios.defaults.baseURL}upload/`+ modalImage"
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
            title="Ташхис"
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
                class="pt-2"
              >
                <b-container fluid style="height: 385px; overflow-y: auto;">
                  <b-row>
                    <b-col sm="1" md="1" lg="1" xl="1">
                      <b-button
                        variant="primary"
                        block
                        style="display: none"
                        v-b-tooltip.hover.v-primary.bottom
                        title="Шаблонлар"
                        v-b-modal="'my-template-' + index"
                        @click="GetTemplates(index)"
                        ><b-icon icon="layers-fill"></b-icon>
                      </b-button>
                      <!-- template modal start -->
                      <b-modal
                        :id="'my-template-' + index"
                        hide-footer
                        title="Шаблонлар"
                        size="lg"
                      >
                        <b-row>
                          <b-col sm="1" md="1" lg="1" xl="1">
                            <b-button
                              variant="success"
                              class="mb-1"
                              v-b-tooltip.hover.v-success.topright
                              title="Шаблон қўшиш"
                              @click="modalAddTemplate = !modalAddTemplate"
                            >
                              <b-icon icon="plus"></b-icon>
                            </b-button>
                            <!-- Template form modal start -->
                            <b-modal
                              hide-footer
                              title="Шаблон яратиш"
                              size="lg"
                              v-model="modalAddTemplate"
                            >
                              <b-row>
                                <b-col sm="12" md="12" lg="12" xl="12">
                                  <label for="template-name" class="mb-0"
                                    >Шаблон Номи</label
                                  >
                                  <b-form-input
                                    id="template-name"
                                    type="text"
                                    v-model="doctor_template.template_name"
                                    class="px-1 mb-1 rmk-input"
                                    @blur="CheckTemplateName()"
                                  ></b-form-input>
                                  <span
                                    style="color: red;"
                                    v-if="checkTemplateName"
                                    >"Шаблон Номи"ни тўлдириш шарт</span
                                  >
                                </b-col>
                                <b-col sm="12" md="12" lg="12" xl="12">
                                  <label
                                    for="template-patient-complaint"
                                    class="mb-0"
                                    >Бемор шикояти</label
                                  >
                                  <b-form-textarea
                                    id="template-patient-complaint"
                                    rows="3"
                                    max-rows="8"
                                    class="px-1 rmk-input"
                                    v-model="doctor_template.complaint"
                                  ></b-form-textarea>
                                </b-col>
                                <b-col sm="12" md="12" lg="12" xl="12">
                                  <label
                                    for="template-illness-history"
                                    class="mb-0"
                                    >Касаллик тарихи</label
                                  >
                                  <b-form-textarea
                                    id="template-illness-history"
                                    rows="3"
                                    max-rows="8"
                                    class="px-1 rmk-input"
                                    v-model="doctor_template.medical_history"
                                  ></b-form-textarea>
                                </b-col>
                                <b-col sm="12" md="12" lg="12" xl="12">
                                  <label
                                    for="template-objective-survey"
                                    class="mb-0"
                                    >Объектив текшириш</label
                                  >
                                  <b-form-textarea
                                    id="template-objective-survey"
                                    rows="3"
                                    max-rows="8"
                                    class="px-1 rmk-input"
                                    v-model="doctor_template.objective_vision"
                                  ></b-form-textarea>
                                </b-col>
                                <b-col sm="12" md="12" lg="12" xl="12">
                                  <label
                                    for="template-labaratory-entry"
                                    class="mb-0"
                                    >Инструментал текшириш</label
                                  >
                                  <b-form-textarea
                                    id="template-labaratory-entry"
                                    rows="3"
                                    max-rows="8"
                                    class="px-1 rmk-input"
                                    v-model="doctor_template.instrumental"
                                  ></b-form-textarea>
                                </b-col>
                                <b-col sm="12" md="12" lg="12" xl="12">
                                  <label
                                    for="template-main-diagnosis"
                                    class="mb-0"
                                    >Aсосий ташхис</label
                                  >
                                  <b-form-textarea
                                    id="template-main-diagnosis"
                                    rows="3"
                                    max-rows="8"
                                    class="px-1 rmk-input"
                                    v-model="doctor_template.diagnos"
                                  ></b-form-textarea>
                                </b-col>
                                <b-col sm="12" md="12" lg="12" xl="12">
                                  <label for="template-procedure" class="mb-0"
                                    >Даволаш</label
                                  >
                                  <b-form-textarea
                                    id="template-procedure"
                                    rows="3"
                                    max-rows="8"
                                    class="px-1 rmk-input"
                                    v-model="doctor_template.procedure"
                                  ></b-form-textarea>
                                </b-col>
                                <b-col sm="12" md="12" lg="12" xl="12">
                                  <label for="template-recommended" class="mb-0"
                                    >Тавсия</label
                                  >
                                  <b-form-textarea
                                    id="template-recommended"
                                    rows="3"
                                    max-rows="8"
                                    class="px-1 rmk-input"
                                    v-model="doctor_template.recommended"
                                  ></b-form-textarea>
                                </b-col>
                                <b-col sm="3" md="3" lg="3" xl="3">
                                  <b-button
                                    :disabled="save_template"
                                    class="mt-1"
                                    variant="success"
                                    @click="SaveTemplate()"
                                  >
                                    <b-spinner
                                      small
                                      v-if="save_template"
                                    ></b-spinner>
                                    Сақлаш
                                  </b-button>
                                </b-col>
                              </b-row>
                            </b-modal>
                            <!-- Template form modal end -->
                          </b-col>
                          <b-col sm="11" md="11" lg="11" xl="11">
                            <b-form-group
                              label-for="filter-input-template"
                              label-align-sm="right"
                              label-size="sm"
                              class="mb-0"
                            >
                              <b-input-group size="sm">
                                <b-form-input
                                  id="filter-input-template"
                                  v-model="filterTemplate"
                                  type="search"
                                  placeholder="Қидириш..."
                                ></b-form-input>

                                <b-input-group-append>
                                  <b-button
                                    variant="danger"
                                    size="sm"
                                    :disabled="!filterTemplate"
                                    @click="filterTemplate = ''"
                                    >Тозалаш</b-button
                                  >
                                </b-input-group-append>
                              </b-input-group>
                            </b-form-group>
                          </b-col>
                          <b-table
                            :items="templates"
                            bordered
                            :fields="fieldsTemplate"
                            :filter="filterTemplate"
                            :current-page="currentPageTemplate"
                            stacked="md"
                            hover
                            show-empty
                            small
                            class="mx-1"
                            style="cursor:pointer"
                            striped
                            @row-clicked="AddTemplate"
                            @filtered="onFilteredTemplate"
                          >
                            <template #cell(name)="row">
                              {{ row.value.template_name }}
                            </template>
                            <template #cell(action)="row">
                              <b-button
                                variant="outline-primary"
                                size="sm"
                                style="color: #1E90FF"
                                @click="UpdateTemplate(row.item.id)"
                                v-b-tooltip.hover.left.v-primary
                                title="Таҳрирлаш"
                              >
                                <b-icon icon="Pencil"></b-icon>
                              </b-button>
                              <b-button
                                variant="outline-danger"
                                size="sm"
                                @click="DeleteTemplate(row.item.id)"
                                v-b-tooltip.hover.right.v-danger
                                title="Ўчириш"
                              >
                                <b-icon icon="trash"></b-icon>
                              </b-button>
                            </template>
                          </b-table>
                        </b-row>
                      </b-modal>
                      <!-- template modal end -->
                    </b-col>
                    <!-- diagnosis fields start -->
                    <b-col sm="11" md="11" lg="11" xl="11">
                      <label
                        for="textarea-illness-history"
                        class="rmk-label-doctor"
                        >История болезни(Анамнез)</label
                      >
                      <b-form-textarea
                        id="textarea-illness-history"
                        rows="3"
                        v-model="item.medical_history"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
                        @blur="CheckStatusDoctor(item.doctor_id, index)"
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
                        >Объективный осмотр</label
                      >
                      <b-form-textarea
                        id="textarea-objective-survey"
                        rows="3"
                        v-model="item.objective_vision"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
                        @change="CheckStatusDoctor(item.doctor_id, index)"
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
                        >Инструментальные обследование</label
                      >
                      <b-form-textarea
                        id="textarea-labaratory-entry"
                        rows="3"
                        v-model="item.instrumental"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
                        @change="CheckStatusDoctor(item.doctor_id, index)"
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
                        >Главный диагноз
                        <b-button
                          variant="light"
                          size="sm"
                          class="p-0"
                          style="color: #3c8dbc"
                          @click="GetMKB(index); modalMKBShow = true;"
                          :disabled="item.doctor.id !== doctor_id"
                          >МКБ-10</b-button
                        >
                      </label>
                      <b-form-textarea
                        id="textarea-main-diagnosis"
                        rows="1"
                        :value="item.diagnos_name != null ? item.diagnos_name.name : ''"
                        max-rows="3"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
                        @change="CheckStatusDoctor(item.doctor_id, index)"
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
                      <label for="textarea-procedure" class="rmk-label-doctor"
                        >Лечение</label
                      >
                      <b-form-textarea
                        id="textarea-procedure"
                        rows="3"
                        v-model="item.procedure"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
                        @change="CheckStatusDoctor(item.doctor_id, index)"
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
                      <label for="textarea-recommended" class="rmk-label-doctor"
                        >Рекомендация</label
                      >
                      <b-form-textarea
                        id="textarea-recommended"
                        rows="3"
                        v-model="item.recommended"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== doctor_id"
                        @change="CheckStatusDoctor(item.doctor_id, index)"
                      ></b-form-textarea>
                    </b-col>
                    <!-- diagnosis fields end -->
                    <!-- МКБ modal start -->
                    <b-modal
                      id="modal-mkb"
                      size="xl"
                      hide-footer
                      title="МКБ-10"
                      v-model="modalMKBShow"
                    >
                      <div style="height: 400px; overflow-y: auto;">
                        <p v-for="(item_parent, index_parent) in mkb" :key="index_parent">
                          <b-button
                            v-b-toggle="'mkb-collapse-' + index_parent"
                            variant="primary"
                            size="sm"
                          >
                            <b-icon
                              icon="folder-minus"
                              class="when-open"
                            ></b-icon>
                            <b-icon
                              icon="folder-plus"
                              class="when-closed"
                              @click="GetMKBChild(item_parent, index_parent)"
                            ></b-icon>
                          </b-button>
                          &emsp;<span class="badge badge-success">{{
                            item_parent.code
                          }}</span
                          >&emsp;
                          <span
                            style="cursor: pointer;"
                            @click="SetMKB(item_parent)"
                            >{{ item_parent.name }}</span
                          >
                          <b-collapse :id="'mkb-collapse-' + index_parent">
                            <!-- mkb child start -->
                            <b-card>
                              <p
                                v-for="(item_child, index_child) in item_parent.child"
                                :key="index_child"
                              >
                                <b-button
                                  v-b-toggle="'mkb-child-collapse-' + index_child"
                                  variant="primary"
                                  size="sm"
                                >
                                  <b-icon
                                    icon="folder-minus"
                                    class="when-open"
                                  ></b-icon>
                                  <b-icon
                                    icon="folder-plus"
                                    class="when-closed"
                                    @click="GetMKBGrandChild(item_child, index_parent, index_child)"
                                  ></b-icon>
                                </b-button>
                                &emsp;<span class="badge badge-success">{{
                                  item_child.code
                                }}</span
                                >&emsp;
                                <span style="cursor: pointer;" @click="SetMKB(item_child)">{{
                                  item_child.name
                                }}</span>
                                <b-collapse :id="'mkb-child-collapse-' + index_child">
                                  <!-- mkb grandchild start -->
                                  <b-card>
                                    <p
                                      v-for="(item_grandchild, index_grandchild) in item_child.grandchild"
                                      :key="index_grandchild"
                                    >
                                      <b-button
                                        v-b-toggle="'mkb-grandchild-collapse-' + index_grandchild"
                                        variant="primary"
                                        size="sm"
                                      >
                                        <b-icon
                                          icon="folder-minus"
                                          class="when-open"
                                        ></b-icon>
                                        <b-icon
                                          icon="folder-plus"
                                          class="when-closed"
                                          @click="GetMKBGrandGrandChild(item_grandchild, index_parent, index_child, index_grandchild)"
                                        ></b-icon>
                                      </b-button>
                                      &emsp;<span class="badge badge-success">{{
                                        item_grandchild.code
                                      }}</span
                                      >&emsp;
                                      <span style="cursor: pointer;" @click="SetMKB(item_grandchild)">{{
                                        item_grandchild.name
                                      }}</span>
                                      <b-collapse :id="'mkb-grandchild-collapse-' + index_grandchild">
                                        <!-- mkb grandgrandchild start -->
                                        <b-card>
                                          <p
                                            v-for="(item_grandgrandchild, index_grandgrandchild) in item_grandchild.grandgrandchild"
                                            :key="index_grandgrandchild"
                                          >
                                            <b-button
                                              v-b-toggle="'mkb-grandgrandchild-collapse-' + index_grandgrandchild"
                                              variant="primary"
                                              size="sm"
                                            >
                                              <b-icon
                                                icon="folder-minus"
                                                class="when-open"
                                              ></b-icon>
                                              <b-icon
                                                icon="folder-plus"
                                                class="when-closed"
                                              ></b-icon>
                                            </b-button>
                                            &emsp;<span class="badge badge-success">{{
                                              item_grandgrandchild.code
                                            }}</span
                                            >&emsp;
                                            <span style="cursor: pointer;" @click="SetMKB(item_grandgrandchild)">{{
                                              item_grandgrandchild.name
                                            }}</span>
                                            <b-collapse :id="'mkb-grandgrandchild-collapse-' + index_grandgrandchild">
                                              <b-card>
                                                ***
                                              </b-card>
                                            </b-collapse>
                                          </p>
                                        </b-card>
                                        <!-- mkb grandgrandchild end -->
                                      </b-collapse>
                                    </p>
                                  </b-card>
                                  <!-- mkb grandchild end -->
                                </b-collapse>
                              </p>
                            </b-card>
                            <!-- mkb child end -->
                          </b-collapse>
                        </p>
                      </div>
                    </b-modal>
                    <!-- МКБ modal end -->
                  </b-row>
                </b-container>
              </b-tab>
            </b-tabs>
          </b-tab>
          <!-- diagnosis section end -->
          <!-- recipe section start -->
          <b-tab
            title="Рецеп"
            :title-link-class="linkClass(4)"
            class="pt-1"
            v-if="role === $store.state.DOCTOR || role === $store.state.ITMED"
          >
            <b-button
              variant="primary"
              class="m-1"
              @click="modalDrugShow = !modalDrugShow"
            >
              <b-icon icon="circle-half"></b-icon>
              Дори қўшиш
            </b-button>
            <!-- add drug modal start -->
            <b-modal
              hide-footer
              size="lg"
              title="Дори қўшиш"
              v-model="modalDrugShow"
            >
              <label for="drug-input">Дори номи</label>
              <b-form-input
                id="drug-input"
                v-model="drug.name"
                class="rmk-textarea px-1"
              ></b-form-input>
              <b-button
                style="color: #fff;"
                variant="success"
                @click="CreateDrug()"
                :disabled="drug_save"
              >
                <b-spinner small type="grow" v-if="drug_save"></b-spinner>
                <b-icon icon="clipboard-check"></b-icon>
                Сақлаш
              </b-button>
            </b-modal>
            <!-- add drug modal end -->
            <b-button
              variant="primary"
              class="m-1"
              @click="GetDrug(); modalDrugList = !modalDrugList"
            >
              <b-icon icon="receipt"></b-icon>
              Дорилар рўйҳати
            </b-button>
            <!-- drug list modal start -->
            <b-modal
              hide-footer
              size="xl"
              title="Дорилар рўйҳати"
              v-model="modalDrugList"
            >
              <b-container fluid>
                <!-- Drug Interface controls -->
                <b-row>
                  <b-col sm="6" md="6" lg="6" xl="6">
                    <b-form-group
                      label="Қидирув"
                      label-for="filter-input"
                      label-align-sm="left"
                      label-size="sm"
                      class="mb-0"
                    >
                      <b-input-group size="sm">
                        <b-form-input
                          id="filter-input"
                          v-model="filterDrug"
                          type="search"
                          placeholder="Қидириш..."
                        ></b-form-input>

                        <b-input-group-append>
                          <b-button
                            variant="danger"
                            size="sm"
                            :disabled="!filterDrug"
                            @click="filterDrug = ''"
                            >Тозалаш</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>

                  <b-col sm="6" md="6" lg="6" xl="6">
                    <b-form-group
                      label="Ҳар бир сахифада"
                      label-for="per-page-select"
                      label-align-sm="left"
                      label-size="sm"
                      class="mb-0"
                    >
                      <b-form-select
                        id="per-page-select"
                        v-model="perPageDrug"
                        :options="pageOptionsDrug"
                        size="sm"
                      ></b-form-select>
                    </b-form-group>
                    <b-pagination
                      v-model="currentPageDrug"
                      :total-rows="totalRowsDrug"
                      :per-page="perPageDrug"
                      align="fill"
                      size="sm"
                      class="mt-2"
                    ></b-pagination>
                  </b-col>
                </b-row>
                <!-- Drug search table element start -->
                <div style="height: 270px; overflow-y: auto;">
                  <b-table
                    :items="drugs"
                    bordered
                    :fields="fieldsDrug"
                    :current-page="currentPageDrug"
                    :per-page="perPageDrug"
                    :filter="filterDrug"
                    :filter-included-fields="filterOnDrug"
                    :sort-desc.sync="sortDescDrug"
                    stacked="md"
                    hover
                    show-empty
                    small
                    @filtered="onFilteredDrug"
                  >
                    <template #cell(items)="row">
                      {{ row.value.name }}
                    </template>
                  </b-table>
                </div>
                <!-- Drug search table element end -->
              </b-container>
            </b-modal>
            <!-- drug list modal end -->

            <!-- alert start -->
            <div class="container-fluid" style="position:absolute;" v-if="drug_alert">
              <div class="row justify-content-md-center">
                <div
                  class="col-xl-6 col-lg-6 col-md-6 col-xs-6 alert alert-success"
                >
                  <button
                    type="button"
                    aria-hidden="true"
                    class="close"
                    @click="drug_alert = false"
                  >
                    ×
                  </button>
                  <span><b>Дори Қўшилди!</b></span>
                </div>
              </div>
            </div>
            <!-- alert end -->

            <b-tabs v-model="tabRecipeIndex" card v-if="data.doctor.length > 0">
              <b-tab
                v-for="(item, index) in data.doctor"
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
                            <th>
                              #
                              <b-button
                                @click="Addrow(index)"
                                style="color: #ffffff;"
                                variant="info"
                                size="sm"
                                v-b-tooltip.hover.v-info.topright
                                title="Қатор қўшиш"
                                :disabled="item.doctor.id !== doctor_id"
                                >+</b-button
                              >
                            </th>
                            <th style="width:400px">Дори</th>
                            <th>Кун</th>
                            <th>Маҳал</th>
                            <th>Қўшимчалар</th>
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
                                placeholder="Танланг..."
                                label="name"
                                :disabled="item.doctor.id !== doctor_id"
                                @input="
                                  CheckStatusDoctor(item.doctor_id, index)
                                "
                              >
                              </v-select>
                            </td>
                            <td>
                              <input
                                class="form-control form-control-sm"
                                type="number"
                                v-model="item2.day"
                                :disabled="item.doctor.id !== doctor_id"
                                @change="
                                  CheckStatusDoctor(item.doctor_id, index)
                                "
                              />
                            </td>
                            <td>
                              <input
                                class="form-control form-control-sm"
                                type="number"
                                v-model="item2.time"
                                @change="
                                  CheckStatusDoctor(item.doctor_id, index)
                                "
                                :disabled="item.doctor.id !== doctor_id"
                              />
                            </td>
                            <td>
                              <input
                                class="form-control form-control-sm"
                                type="text"
                                v-model="item2.comment"
                                :disabled="item.doctor.id !== doctor_id"
                                @change="Addrow(index); CheckStatusDoctor(item.doctor_id, index);"
                              />
                            </td>
                            <td class="text-center">
                              <b-icon
                                icon="trash"
                                style="cursor: pointer;"
                                variant="danger"
                                font-scale="1.2"
                                v-b-tooltip.hover.v-danger.right="
                                  'Дорини Ўчириш'
                                "
                                v-if="item.doctor.id === doctor_id"
                                @click="RemoveDrug(index, index2)"
                              ></b-icon>
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
            v-if="
              role === $store.state.DOCTOR ||
                role === $store.state.ITMED ||
                role === $store.state.REGISTRATION
            "
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
                      <tr v-for="(item, index) in data.files" :key="index">
                        <th>{{ index + 1 }}</th>
                        <td>{{ item.href }}</td>
                        <td>
                          <a
                            :href="'http://localhost:3000/upload/' + item.href"
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
          <!-- room section start -->
          <b-tab
            title="Хона бириктириш"
            :title-link-class="linkClass(6)"
            v-if="role === $store.state.ITMED"
          >
            <b-card-text>
              <b-row>
                <b-col
                  sm="3"
                  offset-sm="1"
                  md="3"
                  offset-md="1"
                  lg="3"
                  offset-lg="1"
                  xl="3"
                  offset-xl="1"
                >
                  <label for="datepicker-first-date">Вақтдан</label><br />
                  <date-picker
                    id="datepicker-first-date"
                    v-model="attach_room.begin_date"
                    format="DD.MM.YYYY"
                    value-type="X"
                    type="date"
                    style="width: 100%"
                    :lang="lang"
                    placeholder="dd.mm.yyyy"
                  ></date-picker>
                </b-col>
                <b-col sm="3" md="3" lg="3" xl="3">
                  <label for="input-date-range">Кун</label>
                  <b-form-input
                    style="border: 1px solid #CACACA; border-radius: 4px"
                    id="input-date-range"
                    type="number"
                    v-model.number="attach_room.add_date"
                    class="px-1"
                    @change="AddDate()"
                  ></b-form-input>
                </b-col>
                <b-col sm="3" md="3" lg="3" xl="3">
                  <label for="datepicker-second-date">Вақтгача</label><br />
                  <date-picker
                    id="datepicker-second-date"
                    v-model="attach_room.end_date"
                    format="DD.MM.YYYY"
                    value-type="X"
                    style="width: 100%"
                    type="date"
                    :lang="lang"
                    placeholder="dd.mm.yyyy"
                  ></date-picker>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2">
                  <b-button variant="success" class="mt-4" @click="GetRoom()">
                    <b-icon icon="eye-fill"></b-icon>
                    Кўриш
                  </b-button>
                </b-col>
                <b-col
                  sm="6"
                  offset-sm="3"
                  md="6"
                  offset-md="3"
                  lg="6"
                  offset-lg="3"
                  xl="6"
                  offset-xl="3"
                  v-if="checkRoom"
                >
                  <!-- room alert start -->
                  <b-alert
                    show
                    dismissible
                    class="mt-2 text-center"
                    variant="warning"
                  >
                    Саналарни танланг!
                  </b-alert>
                  <!-- room alert end -->
                </b-col>
              </b-row>
              <!-- attach room modal start -->
              <b-modal
                hide-footer
                size="lg"
                title="Хоналар Рўйҳати"
                v-model="modalRoomShow"
              >
                <b-row>
                  <b-col sm="6" md="6" lg="6" xl="6">
                    <b-form-group
                      label-for="filter-input-room"
                      label-align-sm="right"
                      label-size="sm"
                      class="mb-0"
                    >
                      <b-input-group size="sm">
                        <b-form-input
                          id="filter-input-room"
                          v-model="filterRoom"
                          type="search"
                          placeholder="Қидириш..."
                        ></b-form-input>

                        <b-input-group-append>
                          <b-button
                            variant="danger"
                            size="sm"
                            :disabled="!filterRoom"
                            @click="filterRoom = ''"
                            >Тозалаш</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6">
                    <b-pagination
                      v-model="currentPageRoom"
                      :total-rows="totalRowsRoom"
                      :per-page="perPageRoom"
                      align="fill"
                      size="sm"
                      class="mt-2"
                    ></b-pagination>
                  </b-col>
                  <b-table
                    :items="rooms"
                    bordered
                    :fields="fieldsRoom"
                    :filter="filterRoom"
                    stacked="md"
                    :current-page="currentPageRoom"
                    :per-page="perPageRoom"
                    hover
                    show-empty
                    small
                    style="cursor:pointer"
                    striped
                    @row-clicked="AddRoom"
                    @filtered="onFilteredRoom"
                  >
                    <template #cell(name)="row">
                      {{ row.value.full_name }}
                    </template>
                  </b-table>
                </b-row>
              </b-modal>
              <!-- attach room modal end -->
              <!-- table start -->
              <b-container
                v-if="data.room.length > 0"
                fluid
                style="height: 370px; overflow-y: auto;"
              >
                <table
                  class="table table-bordered table-striped table-hover table-bordered table-sm mt-2"
                >
                  <thead>
                    <tr class="table-primary">
                      <th>Хона</th>
                      <th>Келган вақти</th>
                      <th>Кетиш вақти</th>
                      <th>Нарҳи</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in data.room" :key="index">
                      <td>
                        {{ item.room ? item.room.full_name : item.full_name }}
                      </td>
                      <td>{{ item.begin_date | moment }}</td>
                      <td>{{ item.end_date | moment }}</td>
                      <td>{{ item.price }}</td>
                      <td class="text-center">
                        <b-icon
                          icon="trash"
                          style="cursor: pointer;"
                          variant="danger"
                          font-scale="1.2"
                          v-b-tooltip.hover.v-danger.right="'Ўчириш'"
                          @click="RemoveRoom(index)"
                        ></b-icon>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </b-container>
              <!-- table end -->
            </b-card-text>
          </b-tab>
          <!-- room section end -->
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
// const axios = require("axios");
export default {
  components: { DatePicker },
  data: () => ({
    registration_id: 0,
    role: null,
    checkBody: false,
    checkSpinner: false,
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
    attach_room: {
      begin_date: null,
      end_date: null,
      add_date: null
    },
    lang: {
      formatLocale: {
        firstDayOfWeek: 1
      },
      monthBeforeYear: false
    },
    doctor_id: parseInt(localStorage.getItem("did")),
    ins_user_id: parseInt(localStorage.getItem("oid")),
    drug: { name: null },
    drug_save: false,
    drug_alert: false,
    tabIndex: 0,
    tableIndex: 0,
    tabDoctorIndex: 0,
    tabRecipeIndex: 0,
    modalRoomShow: false,
    modalInspectionShow: false,
    modalPatientShow: false,
    modalDoctorShow: false,
    modalDrugShow: false,
    modalMKBShow: false,
    modalAddTemplate: false,
    modalDrugList: false,
    operators: [],
    typeServices: [
      { name: "ambulator", label: "Амбулатор" },
      { name: "statsionar", label: "Стационар" }
    ],
    regions: [],
    districts: [],
    neighboarhoods: [],
    inspections: [],
    branches: [],
    doctors: [],
    rooms: [],
    images: [],
    doctor_template: {
      template_name: "",
      complaint: "",
      medical_history: "",
      objective_vision: "",
      instrumental: "",
      diagnos: "",
      recommended: "",
      procedure: ""
    },
    //patient search
    patients: [],
    fields: [
      {
        key: "fullname",
        label: "ФИШ",
        sortable: true
      },
      {
        key: "district.name",
        label: "Туман",
        sortable: true
      },
      {
        key: "neighboarhood.name",
        label: "Махалла",
        sortable: true,
        filterByFormatted: true
      }
    ],
    totalRows: 1,
    currentPage: 1,
    perPage: 10,
    pageOptions: [10, 50, 70, { value: 100, text: "Ҳаммаси" }],
    sortDesc: false,
    filter: "",
    //drug search
    drugs: [],
    fieldsDrug: [
      {
        key: "name",
        label: "Дори номи",
        sortable: true,
        sortDirection: "desc",
        _rowVariant: "primary"
      }
    ],
    totalRowsDrug: 1,
    currentPageDrug: 1,
    perPageDrug: 10,
    pageOptionsDrug: [10, 50, 70, { value: 100, text: "Ҳаммаси" }],
    sortDescDrug: false,
    filterDrug: null,
    filterOnDrug: [],
    patient_sending: false,
    dismissSecs: 3,
    dismissCountDown: 0,
    checkRoom: false,
    filterRoom: null,
    fieldsRoom: [
      {
        key: "full_name",
        label: "Хона Рақами",
        sortable: true
      }
    ],
    currentPageRoom: 1,
    perPageRoom: 50,
    totalRowsRoom: 1,
    templates: [],
    filterTemplate: null,
    fieldsTemplate: [
      {
        key: "template_name",
        label: "Шаблон Номи",
        sortable: true
      },
      {
        key: "action",
        label: ""
      }
    ],
    currentPageTemplate: 1,
    totalRowsTemplate: 1,
    checkName: false,
    checkLastName: false,
    checkPatronymic: false,
    checkPatientStatus: false,
    PatientStatusText: null,
    checkOperator: false,
    printing: false,
    history: false,
    selectedFile: null,
    tashxisfile: "",
    modalImageShow: false,
    modalImage: null,
    inspection_files: null,
    mkb: [],
    ins_child: [],
    saving: false,
    save_template: false,
    checkTemplateName: false
  }),
  async mounted() {
    let self = this;
    self.role = localStorage.getItem("role");
    self.checkBody = true;
    await self.GetOperators();
    await self.GetRegions();
    await self.GetBranches();
    await self.GetDrug();

    //update patient => bemorni tahrirlash
    if (self.$route.path != "/patient/create") {
      try {
        // self.checkSpinner = true;
        const response = await self.axios.get(
          "api/registration/id/" + self.$route.params.id
        );
        self.data = response.data;
        await self.GetPatientById(response.data.patient_id);
        await self.GetMKB(0);
        // self.checkSpinner = false;
        self.checkBody = true;
      } catch (error) {
        self.$store.state.errors = error;
      }
    }
  },
  methods: {
    Close() {
      this.$router.push({ path: "/patient/index" });
      window.close();
    },
    async Save() {
      let self = this;
      self.saving = true;
      if (self.$route.path == "/patient/create") {
        var methods = "post";
        var action = "api/registration";
      } else {
        var methods = "patch";
        var action = "api/registration/id/" + self.$route.params.id;
      }
      try {
        const response = await self.axios({
          method: methods,
          url: action,
          data: self.data
        });
        self.saving = false;
        window.close();
      } catch (error) {
        // self.$store.state.errors = error;
      }
    },
    async print() {
      let self = this;
      self.CheckOperator();
      if (self.checkOperator == false) {
        self.printing = true;

        if (self.$route.path == "/patient/create") {
          var methods = "post";
          var action = "api/registration";
        } else {
          var methods = "patch";
          var action = "api/registration/id/" + self.$route.params.id;
        }
        try {
          const response = await self.axios({
            method: methods,
            url: action,
            data: self.data
          });
          self.printing = false;
          if (response) {
            try {
              const response1 = await self.axios.get(
                "api/registration/queue/patient/" + self.data.patient_id
              );
              localStorage.setItem("printData", JSON.stringify(response1.data));
              const route = self.$router.resolve({
                path: "/patient/checkprint"
              });
              window.open(route.href, "_blank");
              setTimeout(() => {
                window.close();
              }, 3000);
            } catch (error) {
              // self.$store.state.errors = error;
            }
          }
        } catch (error) {
          // self.$store.state.errors = error;
        }
      }
    },
    CheckTemplateName() {
      let self = this;
      self.doctor_template.template_name == ""
        ? (self.checkTemplateName = true)
        : (self.checkTemplateName = false);
    },
    SaveTemplate() {
      let self = this;
      self.CheckTemplateName();
      if (self.checkTemplateName == false) {
        self.save_template = true;
        if (self.doctor_template.id) {
          var urlx = "staff/update_template";
          var id = self.doctor_template.id;
        } else {
          var urlx = "staff/add_template";
          var id = "";
        }
        axios({
          url: urlx,
          method: "post",
          params: {
            id: id
          },
          data: self.doctor_template
        }).then(function(response) {
          self.save_template = false;
          self.modalAddTemplate = false;
          (self.doctor_template.template_name = ""),
            (self.doctor_template.complaint = ""),
            (self.doctor_template.medical_history = ""),
            (self.doctor_template.objective_vision = ""),
            (self.doctor_template.instrumental = ""),
            (self.doctor_template.diagnos = ""),
            (self.doctor_template.recommended = ""),
            (self.doctor_template.procedure = ""),
            self.GetTemplates();
        });
      }
    },
    GetTemplates(index) {
      let self = this;
      if (typeof index != "undefined" && index !== null) {
        localStorage.setItem("i", index);
      }
      //get list of templates => shablonlarni olish
      axios({
        url: "staff/get_templates",
        method: "get"
      }).then(function(response) {
        self.templates = response.data.data;
      });
    },
    DeleteTemplate(id) {
      let self = this;

      axios({
        url: "staff/delete_template",
        method: "post",
        params: {
          id: id
        }
      }).then(function(response) {
        self.GetTemplates();
      });
    },
    UpdateTemplate(id) {
      let self = this;

      axios({
        url: "staff/get_template",
        method: "get",
        params: {
          id: id
        }
      }).then(function(response) {
        self.doctor_template = response.data.data;
        self.modalAddTemplate = true;
      });
    },
    AddTemplate(item) {
      let self = this;
      //get one template => shablonni olish
      axios({
        url: "staff/get_template",
        method: "get",
        params: {
          id: item.id
        }
      }).then(function(response) {
        let index = localStorage.getItem("i");
        self.data.doctor[index].complaint = response.data.data.complaint;
        self.data.doctor[index].medical_history =
          response.data.data.medical_history;
        self.data.doctor[index].objective_vision =
          response.data.data.objective_vision;
        self.data.doctor[index].instrumental = response.data.data.instrumental;
        self.data.doctor[index].diagnos = response.data.data.diagnos;
        self.data.doctor[index].recommended = response.data.data.recommended;
        self.data.doctor[index].procedure = response.data.data.procedure;
        self.$bvModal.hide("my-template-" + index);
      });
    },
    //update doc
    async GetPatientById(id) {
      let self = this;
      try {
        const response = await self.axios.get("api/patient/id/" + id);
        self.patient_datas = response.data;
        self.data.patient_name = response.data.fullname;
        self.patient_datas.birthday = response.data.birthday
          ? response.data.birthday.toString()
          : null;
        await self.GetDistricts();
        await self.GetNeighboarhood();
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    CheckOperator() {
      let self = this;
      self.data.user_id == null
        ? (self.checkOperator = true)
        : (self.checkOperator = false);
    },
    async GetOperators() {
      let self = this;
      //get list of operators => operatorlarni olish
      let id = localStorage.getItem("branch_id");
      try {
        const response = await self.axios.get("api/user/branch/" + id);
        self.operators = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    AddDate() {
      let firstDay = this.attach_room.begin_date;
      let numberDays = this.attach_room.add_date;

      let secondDay = moment.unix(parseInt(firstDay)).add(numberDays, "days");
      this.attach_room.end_date = moment(secondDay).format("X");
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
    async GetInspectionsByBranch() {
      let self = this;
      //tekshiruv bo'limlari ro'yhatini olish
      try {
        const response = await self.axios.get("api/branch/inspection");
        self.inspections = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    RemoveIns(index) {
      let self = this;
      self.data.inspection.splice(index, 1);
    },
    async AddInspectionList(index, indexx) {
      let self = this;
      let ins_data = self.inspections[index].inspection[indexx];
      //tekshiruv jadvalini olish
      try {
        const response = await self.axios.get(
          "api/inspection/id/" + ins_data.id
        );
        ins_data = response.data;
        var children = {
          id: null,
          name: null,
          norm: null,
          text: "",
          parent_id: null,
          price: null,
          file: "",
          status: null,
          registration_id: null
        };
        response.data.child.forEach(element => {
          children.id = element.id;
          children.name = element.name;
          children.norm = element.norm;
          children.parent_id = element.parent_id;
          children.price = element.price;
          children.text = "";
          children.file = "";
          children.status = self.$store.state.WAITING;
          children.registration_id = self.registration_id;

          // console.log(children);
          self.ins_child.push({ ...children });
        });
        ins_data.child = self.ins_child;
        self.ins_child = [];
        ins_data.inspection_id = ins_data.id;
        ins_data.registration_id = 0;
        ins_data.status = self.$store.state.WAITING;

        if (self.$route.path != "/patient/create") {
          self.registration_id = parseInt(self.$route.params.id);
          ins_data.registration_id = parseInt(self.$route.params.id);
          ins_data.inspection_id = ins_data.id;
        }

        self.data.inspection.push({
          ...ins_data
        });
      } catch (error) {
        self.$store.state.errors = error;
      }
      self.modalInspectionShow = false;
    },
    CheckStatusInspection(user_id, index, indeks) {
      let self = this;
      if (user_id == self.ins_user_id) {
        self.data.inspection[index].status = null;
        self.data.inspection[index].child[indeks].status = null;
        self.data.inspection[index].status = "completed";
        self.data.inspection[index].child[indeks].status = "completed";
      }
    },
    CheckStatusDoctor(doctor_id, index) {
      let self = this;
      if (doctor_id == self.doctor_id) {
        self.data.doctor[index].status = null;
        self.data.doctor[index].status = "completed";
      }
    },
    AddDoctor(index, indexx) {
      let self = this;
      let doctor = self.doctors[index].doctor[indexx];
      let doctor_id = self.doctors[index].doctor[indexx].id;
      if (self.$route.path != "/patient/create") {
        self.registration_id = parseInt(self.$route.params.id);
      }
      self.data.doctor.push({
        doctor: doctor,
        doctor_id: doctor_id,
        registration_id: self.registration_id,
        status: self.$store.state.WAITING,
        complaint: "",
        medical_history: "",
        objective_vision: "",
        instrumental: "",
        //mkb-10 id si
        diagnos: null,
        diagnos_name: {name:''},
        procedure: "",
        recommended: "",
        reciept: []
      });

      self.modalDoctorShow = false;
    },
    RemoveDoctor(index) {
      let self = this;
      self.data.doctor.splice(index, 1);
    },
    Addrow(index) {
      this.data.doctor[index].reciept.push({
        doc_id: 0,
        registration_id: 0,
        pill_id: null,
        day: null,
        time: null,
        comment: ""
      });
    },
    RemoveDrug(index, index2) {
      let self = this;
      self.data.doctor[index].reciept.splice(index2, 1);
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onFilteredDrug(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRowsDrug = filteredItems.length;
      this.currentPageDrug = 1;
    },
    CheckName() {
      let self = this;
      self.patient_datas.name == null
        ? (self.checkName = true)
        : (self.checkName = false);
    },
    CheckLastName() {
      let self = this;
      self.patient_datas.lastname == null
        ? (self.checkLastName = true)
        : (self.checkLastName = false);
    },
    CheckPatronymic() {
      let self = this;
      self.patient_datas.patronymic == null
        ? (self.checkPatronymic = true)
        : (self.checkPatronymic = false);
    },
    async SavePatient() {
      let self = this;

      self.CheckName();
      self.CheckLastName();
      self.CheckPatronymic();
      if (
        self.checkName == false &&
        self.checkLastName == false &&
        self.checkPatronymic == false
      ) {
        self.patient_sending = true;

        if (self.patient_datas.id) {
          var methods = "patch";
          var action = "api/patient/id/" + self.patient_datas.id;
          self.PatientStatusText = "Бемор маълумотлари таҳрирланди!";
        } else {
          var methods = "post";
          var action = "api/patient";
          self.PatientStatusText = "Бемор маълумотлари сақланди!";
        }

        try {
          const response = await self.axios({
            url: action,
            method: methods,
            data: self.patient_datas
          });
          self.patient_sending = false;
          self.data.patient_id = parseInt(response.data.id);
          self.data.patient_name = response.data.fullname;
          self.checkPatientStatus = true;
        } catch (error) {
          // self.$store.state.errors = error;
        }
      }
    },
    async GetPatient() {
      let self = this;
      //bemorlar ro'yhatini olish
      try {
        const response = await self.axios({
          url: "api/patient",
          method: "get"
        });
        self.patients = response.data;
        self.totalRows = self.patients.length;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    async GetDoctors() {
      let self = this;
      //shifokorlar ro'yhatini olish
      try {
        const response = await self.axios.get("api/branch/doctor");
        self.doctors = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    async GetRoom() {
      let self = this;
      //xonalar ro'yhatini olish
      if (self.attach_room.begin_date != null) {
        try {
          const response = await self.axios.get("patient/room_list");
          self.rooms = response.data.data;
          self.modalRoomShow = true;
          self.totalRowsRoom = self.rooms.length;
        } catch (error) {
          self.$store.state.errors = error;
        }
      } else {
        self.checkRoom = true;
      }
    },
    AddRoom(item) {
      let self = this;
      // console.log(item)
      item.begin_date = self.attach_room.begin_date;
      item.add_date = self.attach_room.add_date;
      item.end_date = self.attach_room.end_date;
      item.room_id = item.id;
      self.data.room.push({ ...item });
      self.modalRoomShow = false;
    },
    RemoveRoom(index) {
      let self = this;
      self.data.room.splice(index, 1);
    },
    PatientHistory() {
      let self = this;
      const route = self.$router.resolve({
        path: "/patient/history/" + self.data.patient_id
      });
      window.open(route.href, "_blank");
    },
    async CreateDrug() {
      let self = this;
      //dori qo'shish
      self.drug_save = true;
      try {
        const response = await self.axios({
          method: "post",
          url: "api/pill",
          data: self.drug
        });
        self.drug_save = false;
        self.modalDrugShow = false;
        if (response.status == 201) {
          self.drug.name = null;
          self.drug_alert = true;
        }
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    SetMKB(item) {
      let self = this;
      let index = parseInt(localStorage.getItem("index"));
      self.data.doctor[index].diagnos = item.id;
      self.data.doctor[index].diagnos_name = item;
      self.modalMKBShow = false;
      localStorage.removeItem("index");
    },
    async GetMKB(index) {
      let self = this;
      
      localStorage.setItem("index", index);
      
      //mkblar ro'yhatini olish
      try {
        const response = await self.axios.get("api/registration/mkb/0");
        response.data.forEach(element => {
          element.child = [];
        });
        self.mkb = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    async GetMKBChild(item, index) {
      let self = this;
      //mkblar ro'yhatini olish
      try {
        const response = await self.axios.get(
          "api/registration/mkb/" + item.id
        );
        response.data.forEach(element => {
          element.grandchild = [];
        });
        self.mkb[index].child = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    async GetMKBGrandChild(item_child, index_parent, index_child) {
      let self = this;
      //mkblar ro'yhatini olish
      try {
        const response = await self.axios.get(
          "api/registration/mkb/" + item_child.id
        );
        response.data.forEach(element => {
          element.grandgrandchild = [];
        });
        self.mkb[index_parent].child[index_child].grandchild = response.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    async GetMKBGrandGrandChild(item_grandchild, index_parent, index_child, index_grandchild) {
      let self = this;
      //mkblar ro'yhatini olish
      try {
        const response = await self.axios.get(
          "api/registration/mkb/" + item_grandchild.id
        );
        self.mkb[index_parent].child[index_child].grandchild[index_grandchild].grandgrandchild = response.data;
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
        self.totalRowsDrug = self.drugs.length;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    onFilteredRoom(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRowsRoom = filteredItems.length;
      this.currentPageRoom = 1;
    },
    onFilteredTemplate(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRowsTemplate = filteredItems.length;
      this.currentPageTemplate = 1;
    },
    async AddPatient(item) {
      let self = this;
      //get patient => bemor ma'lumotlarini olish
      try {
        const response = await self.axios({
          url: "api/patient/id/" + item.id,
          method: "get"
        });
        self.modalPatientShow = false;
        self.patient_datas = response.data;
        self.patient_datas.birthday = response.data.birthday
          ? response.data.birthday.toString()
          : null;
        await self.GetDistricts();
        await self.GetNeighboarhood();
        self.data.patient_name = response.data.fullname;
        self.data.patient_id = response.data.id;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    async AddUpdatePatient(patient_id) {
      let self = this;
      //get patient datas for update => bemor ma'lumotlarini tahrirlashga olish
      try {
        const response = await self.axios({
          url: "patient/index",
          method: "get",
          params: {
            id: patient_id
          }
        });
        // console.log(response.data);
        if (response.data.level === 1) {
          self.patient_datas = response.data.data;
          self.patient_datas.birthday = response.data.data.birthday.toString();
          self.GetRegions();
          self.GetDistricts();
          self.GetNeighboarhood();
          self.data.patient_name = response.data.data.full_name;
          self.data.patient_id = response.data.data.id;
        } else if (response.data.level === 2) {
          alert(response.data.message);
          window.close();
        } else if (response.data.level === 4) {
          window.close();
        }
      } catch (error) {
        self.$store.state.errors = error;
      }
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
    //tashxis-file
    onUploadTashxis() {
      let self = this;
      const formData = new FormData();
      formData.append("href", self.$refs.files.files[0]);
      axios
        .post("api/upload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          self.tashxisfile = res.data;
          if (self.$route.path != "/patient/create") {
            self.registration_id = self.$route.params.id;
          }
          self.data.files.push({
            href: res.data,
            registration_id: self.registration_id
          });
        });
    },
    //inspection images
    onInsUpload(indeks, index) {
      let self = this;
      let img = document.getElementById("ins_" + index + "_files_" + indeks);
      const formData = new FormData();
      formData.append("href", img.files[0]);
      axios
        .post("api/upload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          self.data.inspection[index].child[indeks].file = res.data;
        });
    },
    ShowImage(image) {
      this.modalImage = image;
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
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
  padding-top: 5px;
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
</style>
