<template>
  <div class="rmk-patient-form">
    <!-- alert start -->
    <div
      class="col-lg-12 col-md-12 col-sm-12 col-xl-12 alert alert-danger text-center"
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
      <span>{{ $store.state.errors }}</span>
    </div>
    <!-- alert end -->
    <b-row>
      <b-col sm="3" md="3" lg="3" xl="3">
        <b-button
          style="color: #fff;"
          variant="primary"
          @click="Save()"
          v-if="
            $cookies.get('user').position === $store.state.KASSA ||
              $cookies.get('user').position === $store.state.ITMED ||
              $cookies.get('user').position === $store.state.UZI ||
              $cookies.get('user').position === $store.state.LABARATORY ||
              $cookies.get('user').position === $store.state.DOCTOR
          "
          :disabled="saving"
        >
          <b-spinner small v-if="saving"></b-spinner>
          <b-icon icon="clipboard-plus"></b-icon>
          Сақлаш ва беркитиш
        </b-button>
      </b-col>
      <b-col
        sm="7"
        offset-sm="2"
        md="7"
        offset-md="2"
        lg="7"
        offset-lg="2"
        xl="7"
        offset-xl="2"
      >
        <b-button
          style="color: #fff; float:right;"
          variant="danger"
          @click="Close()"
          size="sm"
        >
          <b-icon icon="x"></b-icon>
        </b-button>
        &emsp;
        <b-button
          v-if="
            $cookies.get('user').position === $store.state.REGISTRATION ||
              $cookies.get('user').position === $store.state.DOCTOR ||
              $cookies.get('user').position === $store.state.ITMED
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
    </b-row>
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
          <!-- <b-container fluid> -->
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
          <!-- Main table element -->
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
              {{ row.value.full_name }}
              {{ row.value.quarter.name }}
              {{ row.value.district.name_uz }}
            </template>
          </b-table>
          <!-- </b-container> -->
        </b-modal>
        <!-- modal patient search end -->
      </b-col>
      <b-col sm="3" md="3" lg="3" xl="3">
        <label for="operator" class="rmk-label">Оператор</label>
        <b-card no-body>
          <v-select
            id="operator"
            :clearable="true"
            :options="operators"
            v-model="data.staff_id"
            :reduce="full_name => full_name.id"
            label="full_name"
            @input="CheckOperator()"
            placeholder="Операторни танланг..."
          >
          </v-select>
        </b-card>
        <span style="color: red;" v-if="checkOperator"
          >"Оператор"ни танлаш шарт</span
        >
      </b-col>
      <b-col sm="3" md="3" lg="3" xl="3">
        <label for="type_service" class="rmk-label">Хизмат Тури</label>
        <b-card no-body>
          <v-select
            id="type_service"
            :clearable="true"
            :options="typeServices"
            v-model="data.type_id"
            :reduce="full_name => full_name.id"
            label="full_name"
          >
          </v-select>
        </b-card>
      </b-col>
      <b-col sm="2" md="2" lg="2" xl="2">
        <label for="price_must" class="rmk-label">Умумий Сумма</label>
        <b-card no-body>
          <b-form-input
            id="price_must"
            type="number"
            readonly
            v-model="data.payment_data.price_must"
            class="form-control px-1"
          ></b-form-input>
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
      <b-card no-body style="height:528px;">
        <b-tabs v-model="tabIndex" card>
          <b-tab
            title="Бемор маълумотлари"
            :title-link-class="linkClass(0)"
            active
          >
            <b-card-text>
              <b-container fluid>
                <b-row>
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label for="input-full-name">ФИШ</label>
                    <b-form-input
                      id="input-full-name"
                      type="text"
                      v-model="patient_datas.full_name"
                      placeholder="ФИШни тўлдиринг"
                      class="form-control"
                      @blur="CheckName()"
                    ></b-form-input>
                    <span style="color: red;" v-if="checkName"
                      >"ФИШ"ни тўлдириш шарт</span
                    >
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label for="region">Вилоят</label>
                    <v-select
                      id="region"
                      :clearable="true"
                      :options="regions"
                      v-model="patient_datas.region_id"
                      :reduce="name_oz => name_oz.id"
                      label="name_oz"
                      placeholder="Вилоятни танланг..."
                      @input="GetDistricts()"
                    >
                    </v-select>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label for="input-date">Туғилган сана</label><br />
                    <date-picker
                      id="input-date"
                      v-model="patient_datas.birth_date"
                      format="DD.MM.YYYY"
                      value-type="X"
                      style="width: 100%"
                      type="date"
                      :lang="lang"
                      placeholder="Туғилган санани танланг..."
                    ></date-picker>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label for="district">Туман</label>
                    <v-select
                      id="district"
                      :clearable="true"
                      :options="districts"
                      v-model="patient_datas.district_id"
                      :reduce="name_oz => name_oz.id"
                      label="name_oz"
                      placeholder="Туманни танланг..."
                      @input="GetQuarters()"
                    >
                    </v-select>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label for="input-phone">Телефон</label>
                    <b-form-input
                      id="input-phone"
                      v-model="patient_datas.phone"
                      placeholder="+998xxxxxxx"
                      type="tel"
                      class="form-control"
                    ></b-form-input>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label for="mahalla">МФЙ</label>
                    <v-select
                      id="mahalla"
                      :clearable="true"
                      :options="mahallas"
                      v-model="patient_datas.quarter_id"
                      :reduce="name => name.id"
                      label="name"
                      placeholder="МФЙни танланг..."
                    >
                    </v-select>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <p class="m-0 p-0">Жинси</p>
                    <md-radio
                      class="my-1"
                      v-model="patient_datas.gender"
                      @change="CheckGender()"
                      value="male"
                      >Эркак</md-radio
                    >
                    <md-radio
                      class="my-1"
                      v-model="patient_datas.gender"
                      @change="CheckGender()"
                      value="female"
                      >Аёл</md-radio
                    >
                    <p class="m-0 p-0" style="color: red;" v-if="checkGender">
                      "Жинси"ни танлаш шарт
                    </p>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label for="input-street">Кўча</label>
                    <b-form-input
                      id="input-street"
                      type="text"
                      v-model="patient_datas.street"
                      placeholder="Кўчани тўлдиринг"
                      class="form-control"
                    ></b-form-input>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label for="input-passport">Паспорт серия</label>
                    <b-form-input
                      id="input-passport"
                      type="text"
                      v-model="patient_datas.passport"
                      placeholder="AA1234567"
                      class="form-control"
                    ></b-form-input>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="pt-1">
                    <label for="input-address">Уй</label>
                    <b-form-input
                      id="input-address"
                      type="text"
                      v-model="patient_datas.home_address"
                      placeholder="Уйни тўлдиринг"
                      class="form-control"
                    ></b-form-input>
                  </b-col>
                  <b-col
                    sm="6"
                    md="6"
                    lg="6"
                    xl="6"
                    class="pt-1"
                    v-if="
                      $cookies.get('user').position === 'registration' ||
                        $cookies.get('user').position === 'doctor' ||
                        $cookies.get('user').position === 'itmed'
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
                </b-row>
              </b-container>
            </b-card-text>
          </b-tab>
          <b-tab
            title="Текширувлар"
            :title-link-class="linkClass(1)"
            class="pt-2"
            v-if="$cookies.get('user').position !== $store.state.KASSA"
          >
            <b-card-text>
              <b-button
                variant="primary"
                id="show-btn"
                @click="
                  showModal();
                  modalInspectionShow = !modalInspectionShow;
                "
                v-if="
                  $cookies.get('user').position === $store.state.REGISTRATION ||
                    $cookies.get('user').position === $store.state.DOCTOR ||
                    $cookies.get('user').position === $store.state.ITMED
                "
              >
                <b-icon icon="journal-medical"></b-icon>
                Текширувлар
              </b-button>

              <!-- <input ref="fileInput" style="display: none" type="file" @change="onFileSelected">
              <button @click="$refs.fileInput.click()">Yuklash</button>
              <img :src="selectedFile" style="width: 100px">
              <button @click="onUpload">Upload</button>  -->
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
                      {{ item.full_name }}
                    </a>

                    <b-collapse
                      :visible="index == 0 ? true : false"
                      :id="'example-collapse-' + index"
                    >
                      <b-card>
                        <table class="table table-bordered table-sm">
                          <tr>
                            <th>Номи</th>
                            <th>Нархи</th>
                          </tr>
                          <tr
                            @click="AddInspectionList(index, indexx)"
                            v-for="(ins, indexx) in item.children"
                            :key="indexx"
                            style="cursor:pointer"
                          >
                            <td>{{ ins.full_name }}</td>
                            <td>{{ ins.price }}</td>
                          </tr>
                        </table>
                      </b-card>
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
                v-if="data.inspection_list.length > 0"
              >
                <b-tab
                  v-for="(item, index) in data.inspection_list"
                  :key="index"
                  :title="item.full_name"
                  :title-link-class="link_Class(index)"
                  active
                  class="pt-2"
                >
                  <b-card-text>
                    <h5 class="text-center m-0">
                      {{ item.full_name }} &emsp;
                      <b-icon
                        variant="danger"
                        icon="trash"
                        @click="RemoveIns(index)"
                        v-b-tooltip.hover.v-danger.top="'Текширувни Ўчириш'"
                        style="cursor:pointer"
                        v-if="
                          $cookies.get('user').position ===
                            $store.state.REGISTRATION ||
                            $cookies.get('user').position ===
                              $store.state.DOCTOR ||
                            $cookies.get('user').position === $store.state.ITMED
                        "
                      ></b-icon>
                      <span
                        :id="'tooltip-button-variant' + index"
                        class="badge badge-primary float-right"
                        v-if="item.chekable == 0"
                        >{{ item.price }}</span
                      >
                      <b-tooltip
                        :target="'tooltip-button-variant' + index"
                        variant="primary"
                        placement="left"
                        v-if="item.chekable == 0"
                        >Сумма</b-tooltip
                      >
                    </h5>
                    <!-- table start -->
                    <b-container fluid style="height: 312px; overflow-y: auto;">
                      <table
                        class="table table-bordered table-striped table-hover table-bordered table-sm mt-1"
                      >
                        <thead>
                          <tr class="table-primary">
                            <th>#</th>
                            <th v-if="item.chekable == 1">Танлаш</th>
                            <th>Анализ</th>
                            <th>Натижа</th>
                            <!-- <th style="width: 100px;">Расм</th> -->
                            <th>Норма</th>
                            <th>Нархи</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(field, indeks) in item.child_table"
                            :key="indeks"
                          >
                            <th>{{ indeks + 1 }}</th>
                            <td v-if="item.chekable == 1">
                              <input
                                type="checkbox"
                                false-value="0"
                                true-value="1"
                                v-model="field.checked"
                                @change="Summa()"
                              />
                            </td>
                            <td>
                              {{ field.full_name ? field.full_name : "" }}
                            </td>
                            <td>
                              <b-form-textarea
                                rows="1"
                                max-rows="5"
                                v-model="field.result"
                                class="form-control"
                                :readonly="
                                  $cookies.get('user').position ===
                                    $store.state.REGISTRATION
                                "
                              ></b-form-textarea>
                            </td>
                            <!-- <td style="width: 100px;">
                              <input
                                ref="files"
                                type="file"
                                @change="onImageSelected(indeks)"
                              />
                              <img :src="url" style="width: 100px" />
                              <b-button
                                variant="success"
                                size="sm"
                                v-b-tooltip.hover.v-success.right
                                title="Кўриш"
                                class="mt-1"
                                v-b-modal="'image-modal-' + indeks"
                              >
                                <b-icon icon="eye-fill"></b-icon>
                              </b-button>
                              
                              <b-modal
                                :id="'image-modal-' + indeks"
                                hide-footer
                                title="Галарея"
                                size="xl"
                                >Image {{ indeks }} From My Modal!
                              </b-modal>
                            </td> -->
                            <td>{{ field.normative }}</td>
                            <td>{{ field.price }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </b-container>
                    <!-- table end -->
                  </b-card-text>
                </b-tab>
              </b-tabs>
              <!-- inspections table end -->
            </b-card-text>
          </b-tab>
          <b-tab
            title="Шифокор кўриги"
            :title-link-class="linkClass(2)"
            class="pt-2"
            v-if="
              $cookies.get('user').position === $store.state.REGISTRATION ||
                $cookies.get('user').position === $store.state.DOCTOR ||
                $cookies.get('user').position === $store.state.ITMED
            "
          >
            <b-card-text>
              <b-button
                @click="
                  GetDoctors();
                  modalDoctorShow = !modalDoctorShow;
                "
                variant="primary"
                class="ml-3"
              >
                <b-icon icon="person-lines-fill"></b-icon>
                Шифокорлар
              </b-button>
              <!-- doctor list modal start -->
              <b-modal
                v-model="modalDoctorShow"
                title="Шифокорлар"
                size="lg"
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
                    {{ item.full_name }}
                  </a>
                  <b-collapse
                    :visible="index == 0 ? true : false"
                    :id="'doctor-collapse-' + index"
                  >
                    <b-card>
                      <p v-for="(itemm, indexx) in item.section" :key="indexx">
                        <b-button
                          v-b-toggle="'collapse-' + indexx"
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
                          {{ itemm.full_name }}
                        </b-button>
                        <b-collapse :id="'collapse-' + indexx" class="mt-2">
                          <b-card>
                            <table class="table table-bordered table-sm">
                              <tr>
                                <th>ФИШ</th>
                                <th>Кўрик Нархи</th>
                              </tr>
                              <tr
                                @click="AddDoctor(index, indexx, inds)"
                                v-for="(itm, inds) in itemm.staff"
                                :key="inds"
                                style="cursor:pointer"
                              >
                                <td>{{ itm.full_name }}</td>
                                <td>{{ itm.section.price }}</td>
                              </tr>
                            </table>
                          </b-card>
                        </b-collapse>
                      </p>
                    </b-card>
                  </b-collapse>
                </p>
              </b-modal>
              <!-- doctor list modal end -->
              <!-- table start -->
              <b-container
                v-if="data.staff_list.length > 0"
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
                      <th>Кўрик Нархи</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in data.staff_list" :key="index">
                      <th>{{ index + 1 }}</th>
                      <td>
                        {{ item.doctor.full_name ? item.doctor.full_name : "" }}
                      </td>
                      <td>
                        {{
                          item.doctor.section.full_name
                            ? item.doctor.section.full_name
                            : item.doctor.section
                        }}
                      </td>
                      <td>{{ item.doctor.room.full_name }}</td>
                      <td>{{ item.doctor.section.price }}</td>
                      <td class="text-center">
                        <b-icon
                          icon="trash"
                          style="cursor: pointer;"
                          variant="danger"
                          font-scale="1.2"
                          v-b-tooltip.hover.v-danger.right="'Шифокорни Ўчириш'"
                          @click="RemoveDoctor(index)"
                        ></b-icon>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </b-container>
              <!-- table end -->
            </b-card-text>
          </b-tab>
          <b-tab
            title="Хона бириктириш"
            :title-link-class="linkClass(3)"
            v-if="
              $cookies.get('user').position === $store.state.REGISTRATION ||
                $cookies.get('user').position === $store.state.DOCTOR ||
                $cookies.get('user').position === $store.state.ITMED
            "
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
          <b-tab
            title="Ташхис"
            :title-link-class="linkClass(4)"
            class="pt-2"
            v-if="
              $cookies.get('user').position === $store.state.DOCTOR ||
                $cookies.get('user').position === $store.state.ITMED
            "
          >
            <b-tabs
              v-model="tabDoctorIndex"
              card
              v-if="data.staff_list.length > 0"
            >
              <b-tab
                v-for="(item, index) in data.staff_list"
                :key="index"
                :title="item.doctor.full_name ? item.doctor.full_name : ''"
                :title-link-class="linkDoctorClass(index)"
                active
                class="pt-2"
              >
                <b-container fluid style="height: 375px; overflow-y: auto;">
                  <b-row>
                    <b-col sm="1" md="1" lg="1" xl="1">
                      <b-button
                        variant="primary"
                        block
                        v-if="item.doctor.id === $cookies.get('user').id"
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
                                    v-model="doctor_template.patient_complaint"
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
                                    v-model="doctor_template.ilness_history"
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
                                    v-model="doctor_template.objective_survey"
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
                                    v-model="doctor_template.labaratory_entry"
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
                                    v-model="doctor_template.main_diagnosis"
                                  ></b-form-textarea>
                                </b-col>
                                <b-col sm="12" md="12" lg="12" xl="12">
                                  <label
                                    for="template-complications"
                                    class="mb-0"
                                    >Мураккабликлар</label
                                  >
                                  <b-form-textarea
                                    id="template-complications"
                                    rows="3"
                                    max-rows="8"
                                    class="px-1 rmk-input"
                                    v-model="doctor_template.complications"
                                  ></b-form-textarea>
                                </b-col>
                                <b-col sm="12" md="12" lg="12" xl="12">
                                  <label
                                    for="template-companion-diagnosis"
                                    class="mb-0"
                                    >Биргаликдаги ташхис</label
                                  >
                                  <b-form-textarea
                                    id="template-companion-diagnosis"
                                    rows="3"
                                    max-rows="8"
                                    class="px-1 rmk-input"
                                    v-model="
                                      doctor_template.companion_diagnosis
                                    "
                                  ></b-form-textarea>
                                </b-col>
                                <b-col sm="12" md="12" lg="12" xl="12">
                                  <label for="template-treatment" class="mb-0"
                                    >Даволаш</label
                                  >
                                  <b-form-textarea
                                    id="template-treatment"
                                    rows="3"
                                    max-rows="8"
                                    class="px-1 rmk-input"
                                    v-model="doctor_template.treatment"
                                  ></b-form-textarea>
                                </b-col>
                                <b-col sm="12" md="12" lg="12" xl="12">
                                  <label
                                    for="template-recommendation"
                                    class="mb-0"
                                    >Тавсия</label
                                  >
                                  <b-form-textarea
                                    id="template-recommendation"
                                    rows="3"
                                    max-rows="8"
                                    class="px-1 rmk-input"
                                    v-model="doctor_template.recommendation"
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
                    <b-col sm="11" md="11" lg="11" xl="11">
                      <label
                        for="textarea-patient-complaint"
                        class="rmk-label-doctor"
                        >Жалоба больного</label
                      >
                      <b-form-textarea
                        id="textarea-patient-complaint"
                        rows="3"
                        v-model="item.patient_complaint"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== $cookies.get('user').id"
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
                        for="textarea-illness-history"
                        class="rmk-label-doctor"
                        >История болезни</label
                      >
                      <b-form-textarea
                        id="textarea-illness-history"
                        rows="3"
                        v-model="item.ilness_history"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== $cookies.get('user').id"
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
                        v-model="item.objective_survey"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== $cookies.get('user').id"
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
                        v-model="item.labaratory_entry"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== $cookies.get('user').id"
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
                          v-b-modal.modal-mkb
                          >МКБ-10</b-button
                        >
                      </label>
                      <b-form-textarea
                        id="textarea-main-diagnosis"
                        rows="3"
                        v-model="item.main_diagnosis"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== $cookies.get('user').id"
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
                        for="textarea-complications"
                        class="rmk-label-doctor"
                        >Осложнения</label
                      >
                      <b-form-textarea
                        id="textarea-complications"
                        rows="3"
                        v-model="item.complications"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== $cookies.get('user').id"
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
                        for="textarea-companion-diagnosis"
                        class="rmk-label-doctor"
                      >
                        Сопутствующий диагноз
                        <b-button
                          variant="light"
                          size="sm"
                          class="p-0"
                          style="color: #3c8dbc"
                          v-b-modal.modal-mkb
                          >МКБ-10</b-button
                        >
                      </label>
                      <b-form-textarea
                        id="textarea-companion-diagnosis"
                        rows="3"
                        v-model="item.companion_diagnosis"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== $cookies.get('user').id"
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
                      <label for="textarea-treatment" class="rmk-label-doctor"
                        >Лечение</label
                      >
                      <b-form-textarea
                        id="textarea-treatment"
                        rows="3"
                        v-model="item.treatment"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== $cookies.get('user').id"
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
                        for="textarea-recommendation"
                        class="rmk-label-doctor"
                        >Рекомендация</label
                      >
                      <b-form-textarea
                        id="textarea-recommendation"
                        rows="3"
                        v-model="item.recommendation"
                        max-rows="8"
                        class="px-1 rmk-textarea"
                        :disabled="item.doctor.id !== $cookies.get('user').id"
                      ></b-form-textarea>
                    </b-col>
                    <!-- МКБ modal start -->
                    <b-modal
                      id="modal-mkb"
                      size="xl"
                      hide-footer
                      title="МКБ-10"
                    >
                      <p class="my-4">Hello from modal!</p>
                    </b-modal>
                    <!-- МКБ modal end -->
                  </b-row>
                </b-container>
              </b-tab>
            </b-tabs>
          </b-tab>
          <b-tab
            title="Рецеп"
            :title-link-class="linkClass(5)"
            class="pt-1"
            v-if="
              $cookies.get('user').position === $store.state.DOCTOR ||
                $cookies.get('user').position === $store.state.ITMED
            "
          >
            <!-- <b-button variant="primary" class="m-1" @click="modalDrugShow = !modalDrugShow">
              <b-icon icon="circle-half"></b-icon>
              Дори қўшиш
            </b-button> -->
            <!-- add drug modal start -->
            <!-- <b-modal
              hide-footer
              size="lg"
              title="Дори қўшиш"
              v-model="modalDrugShow"
              >
              <label for="drug-input">Дори номи</label>
              <b-form-input id="drug-input" v-model="drug_name" class="rmk-textarea px-1"></b-form-input>
              <b-button
                style="color: #fff;"
                variant="success"
              >
                <b-icon icon="clipboard-check"></b-icon>
                Сақлаш
              </b-button>
            </b-modal> -->
            <!-- add drug modal end -->
            <b-button
              variant="primary"
              class="m-1"
              @click="modalDrugList = !modalDrugList"
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
                  <template #cell(name)="row">
                    {{ row.value.full_name }}
                  </template>
                </b-table>
                <!-- Drug search table element end -->
              </b-container>
            </b-modal>
            <!-- drug list modal end -->
            <b-tabs
              v-model="tabRecipeIndex"
              card
              v-if="data.staff_list.length > 0"
            >
              <b-tab
                v-for="(item, index) in data.staff_list"
                :key="index"
                :title="item.doctor.full_name"
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
                                v-b-tooltip.hover.v-info.topright
                                title="Қатор қўшиш"
                                :disabled="item.doctor.id !== $cookies.get('user').id"
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
                            v-for="(item2, index2) in item.table_medicine"
                            :key="index2"
                          >
                            <th>{{ index2 + 1 }}</th>
                            <td>
                              <v-select
                                :clearable="true"
                                :options="drugs"
                                v-model="item2.tablet_id"
                                :reduce="full_name => full_name.id"
                                placeholder="Танланг..."
                                label="full_name"
                              >
                              </v-select>
                            </td>
                            <td>
                              <input
                                class="form-control form-control-sm"
                                type="number"
                                v-model="item2.day"
                              />
                            </td>
                            <td>
                              <input
                                class="form-control form-control-sm"
                                type="number"
                                v-model="item2.times"
                              />
                            </td>
                            <td>
                              <input
                                class="form-control form-control-sm"
                                type="text"
                                v-model="item2.additional"
                                @change="Addrow(index)"
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
                                :disabled="item.doctor.id !== $cookies.get('user').id"
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
          <b-tab
            title="Тўлов Ойнаси"
            :title-link-class="linkClass(6)"
            v-if="
              $cookies.get('user').position === $store.state.KASSA ||
                $cookies.get('user').position === $store.state.ITMED
            "
          >
            <b-card-text>
              <!-- paytable start -->
              <b-container fluid>
                <form>
                  <b-row style="margin-top: -30px">
                    <b-col md="8" sm="8" lg="8" xl="8">
                      <md-card style="height: 408px;">
                        <table class="table table-hover table-striped table-sm">
                          <thead>
                            <tr class="table-primary">
                              <th>#</th>
                              <th>Сумма</th>
                              <th>Тўлов тури</th>
                              <th>Тўлов</th>
                              <th>Изоҳ</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(item, index) in data.payment_list"
                              :key="index"
                            >
                              <td>{{ index + 1 }}</td>
                              <td>{{ item.price }}</td>
                              <td>{{ item.payType.full_name }}</td>
                              <td>
                                <span
                                  :class="
                                    parseFloat(item.price) > 0
                                      ? 'badge badge-success'
                                      : 'badge badge-danger'
                                  "
                                >
                                  {{
                                    parseFloat(item.price) > 0
                                      ? "Тўланди"
                                      : "Қайтарилди"
                                  }}
                                </span>
                              </td>
                              <td>{{ item.comment }}</td>
                              <td>
                                <b-icon
                                  icon="trash"
                                  style="cursor: pointer;"
                                  @click="DeleteItem(index)"
                                  variant="danger"
                                  v-b-tooltip.hover.v-danger.top="'Ўчириш'"
                                  font-scale="1.2"
                                ></b-icon>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </md-card>
                    </b-col>
                    <b-col md="4" sm="4" lg="4" xl="4">
                      <md-card>
                        <!-- paid line start -->
                        <b-container fluid>
                          <b-row class="my-1">
                            <b-col md="6" xs="6" sm="6" lg="6" xl="6">
                              <b-button
                                block
                                @click="PaySend()"
                                style="color: #ffffff;"
                                variant="primary"
                                :disabled="paySending"
                              >
                                <b-spinner small v-if="paySending"></b-spinner>
                                Тўлаш
                              </b-button>
                            </b-col>
                            <b-col md="6" xs="6" sm="6" lg="6" xl="6">
                              <b-button
                                block
                                @click="CancelPay()"
                                style="color: #ffffff;"
                                variant="danger"
                                :disabled="payCancel"
                              >
                                <b-spinner small v-if="payCancel"></b-spinner>
                                Сумма қайтариш
                              </b-button>
                            </b-col>
                            <b-col md="12" xs="12" sm="12" lg="12" xl="12">
                              <b-icon
                                icon="credit-card2-front"
                                font-scale="1.6"
                                style="color: #87CEEB;"
                              ></b-icon>
                              &nbsp;
                              <label>Тўлов тури</label>
                              <v-select
                                :clearable="true"
                                :options="paytype"
                                v-model="selected_pay"
                                label="full_name"
                              />
                            </b-col>
                            <b-col md="6" xs="6" sm="6" lg="6" xl="6">
                              <md-field>
                                <label>Сумма</label>
                                <md-input
                                  v-model="pay_datas.price"
                                  id="rmk-input-width"
                                  @blur="CheckSumm()"
                                  type="number"
                                ></md-input>
                              </md-field>
                              <span style="color: red;" v-if="checkSumm"
                                >Суммани тўлдириш шарт</span
                              >
                            </b-col>
                            <b-col md="6" xs="6" sm="6" lg="6" xl="6">
                              <md-field>
                                <label>Скидка</label>
                                <md-input
                                  v-model="data.payment_data.discount"
                                  id="rmk-input-width"
                                  type="number"
                                ></md-input>
                              </md-field>
                            </b-col>
                            <b-col md="6" xs="6" sm="6" lg="6" xl="6">
                              <md-field>
                                <b-icon
                                  icon="patch-check"
                                  font-scale="1.6"
                                  variant="success"
                                ></b-icon>
                                <md-icon></md-icon>
                                <label>Тўланди</label>
                                <md-input
                                  v-model="data.payment_data.payment"
                                  readonly
                                  id="rmk-input-width"
                                ></md-input>
                              </md-field>
                            </b-col>
                            <b-col md="6" xs="6" sm="6" lg="6" xl="6">
                              <md-field>
                                <b-icon
                                  icon="patch-minus"
                                  font-scale="1.6"
                                  variant="danger"
                                ></b-icon>
                                <md-icon></md-icon>
                                <label>Қарзи</label>
                                <md-input
                                  v-model="data.payment_data.debt"
                                  readonly
                                  id="rmk-input-width"
                                ></md-input>
                              </md-field>
                            </b-col>
                            <b-col md="12" xs="12" sm="12" lg="12" xl="12">
                              <md-field>
                                <b-icon
                                  icon="chat-square-text"
                                  font-scale="1.6"
                                  variant="warning"
                                ></b-icon>
                                <md-icon></md-icon>
                                <label>Изоҳ</label>
                                <md-textarea
                                  v-model="pay_datas.comment"
                                  md-autogrow
                                ></md-textarea>
                              </md-field>
                            </b-col>
                          </b-row>
                        </b-container>
                        <!-- paid line end -->
                      </md-card>
                    </b-col>
                  </b-row>
                </form>
              </b-container>
              <!-- paytable end -->
            </b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-container>
    <!-- navbar end -->
  </div>
</template>
<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import moment from "moment";
export default {
  components: { DatePicker },
  data: () => ({
    checkBody: false,
    checkSpinner: false,
    patient_datas: {
      full_name: null,
      phone: null,
      birth_date: null,
      gender: null,
      passport: null,
      region_id: null,
      district_id: null,
      quarter_id: null,
      street: null,
      home_address: null
    },
    data: {
      patient_id: null,
      patient_name: null,
      staff_id: null,
      type_id: 1,
      inspection_list: [],
      staff_list: [],
      room: [],
      payment_list: [], //=> operatsiyalar tarixi, to'landi, qaytarildi, shunaqalar
      payment_data: {
        price_must: 0, //=> umumiy summa
        payment: 0, //=> to'lagan summasi
        debt: 0, //=> qarzi
        discount: 0, //=> skidka summasi
        backlog: 0 //=> qaytarilgan summa
      }
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
    drug_name: null,
    tabIndex: 0,
    tableIndex: 0,
    tabDoctorIndex: 0,
    tabRecipeIndex: 0,
    modalRoomShow: false,
    modalInspectionShow: false,
    modalPatientShow: false,
    modalDoctorShow: false,
    modalDrugShow: false,
    modalAddTemplate: false,
    modalDrugList: false,
    operators: [],
    typeServices: [],
    regions: [],
    districts: [],
    mahallas: [],
    inspections: [],
    doctors: [],
    rooms: [],
    images: [],
    doctor_template: {
      template_name: "",
      patient_complaint: "",
      ilness_history: "",
      objective_survey: "",
      labaratory_entry: "",
      main_diagnosis: "",
      complications: "",
      companion_diagnosis: "",
      recommendation: "",
      treatment: ""
    },
    //patient search
    patients: [],
    fields: [
      {
        key: "full_name",
        label: "ФИШ",
        sortable: true
      },
      {
        key: "district.name_uz",
        label: "Туман",
        sortable: true
      },
      {
        key: "quarter.name",
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
        key: "full_name",
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
    checkGender: false,
    checkOperator: false,
    printing: false,
    selectedFile: null,
    url: [],
    //files: [],
    // pay section
    paySending: false,
    payCancel: false,
    checkSumm: false,
    paytype: [],
    selected_pay: [],
    pay_datas: {
      payType: null,
      price: null,
      comment: null,
      pay_type: null
    },
    saving: false,
    save_template: false,
    checkTemplateName: false
  }),
  mounted() {
    let self = this;
    self.checkBody = true;
    //get list type of services => xizmat turlarini olish
    axios({
      url: "universal/registration_type_table_list",
      method: "get"
    }).then(function(response) {
      self.typeServices = response.data.data;
    });
    //get list types of pay => to'lov turlarini olish
    axios({
      url: "universal/get_pay_type",
      method: "get"
    }).then(function(response) {
      self.paytype = response.data.data;
    });
    self.GetOperators();
    self.GetRegions();
    self.GetDrug();

    //update patient => bemorni tahrirlash
    if (self.$route.path != "/patient/create") {
      axios({
        method: "get",
        url: "universal/get_patient",
        params: {
          id: self.$route.params.id,
          useful: 1
        }
      }).then(function(response) {
        // console.log(response.data);
        if (
          self.$cookies.get("user").position === self.$store.state.REGISTRATION
        ) {
          self.checkSpinner = true;
          self.AddUpdatePatient(response.data.data.registration.patient_id);
          self.data.staff_id = response.data.data.registration.staff_id;
          self.data.room = response.data.data.room;
          self.data.inspection_list = response.data.data.inspection_list;
          self.data.staff_list = response.data.data.staff_list;
          self.data.payment_data = response.data.data.payment_data;
          self.data.payment_list = response.data.data.payment_list;
          self.checkSpinner = false;
          self.checkBody = true;
        } else if (
          self.$cookies.get("user").position === self.$store.state.KASSA
        ) {
          self.checkSpinner = true;
          self.AddUpdatePatient(response.data.data.registration.patient_id);
          self.data.staff_id = response.data.data.registration.staff_id;
          self.data.payment_data = response.data.data.payment_data;
          self.data.payment_list = response.data.data.payment_list;
          self.checkSpinner = false;
          self.checkBody = true;
        } else if (
          self.$cookies.get("user").position === self.$store.state.UZI ||
          self.$cookies.get("user").position === self.$store.state.LABARATORY
        ) {
          self.checkSpinner = true;
          self.AddUpdatePatient(response.data.data.registration.patient_id);
          self.data.staff_id = response.data.data.registration.staff_id;
          self.data.inspection_list = response.data.data.inspection_list;
          self.data.payment_data = response.data.data.payment_data;
          self.checkSpinner = false;
          self.checkBody = true;
        } else if (
          self.$cookies.get("user").position === self.$store.state.DOCTOR
        ) {
          self.checkSpinner = true;
          self.AddUpdatePatient(response.data.data.registration.patient_id);
          self.data.staff_id = response.data.data.registration.staff_id;
          self.data.room = response.data.data.room;
          self.data.inspection_list = response.data.data.inspection_list;
          self.data.staff_list = response.data.data.staff_list;
          self.data.payment_data = response.data.data.payment_data;
          self.checkSpinner = false;
          self.checkBody = true;
        }
      });
    }
  },
  methods: {
    Close(){
      this.$router.push({ path: "/patient/index" });
    },
    Save() {
      let self = this;
      self.saving = true;
      // console.log(self.data)
      if (
        self.$cookies.get("user").position === self.$store.state.UZI ||
        self.$cookies.get("user").position === self.$store.state.LABARATORY
      ) {
        var urlx = "staff/labaratory_registration";
      } else if (
        self.$cookies.get("user").position === self.$store.state.KASSA
      ) {
        var urlx = "staff/cash_register";
      } else if (
        self.$cookies.get("user").position === self.$store.state.DOCTOR
      ) {
        var urlx = "staff/doctor_registration";
      }
      axios({
        url: urlx,
        method: "post",
        params: {
          id: self.$route.params.id
        },
        data: self.data
      }).then(function(response) {
        self.saving = false;
        // console.log(response.data);
        window.close();
      });
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
        self.doctor_template.doctor_id = self.$cookies.get("user").id;
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
            (self.doctor_template.patient_complaint = ""),
            (self.doctor_template.ilness_history = ""),
            (self.doctor_template.objective_survey = ""),
            (self.doctor_template.labaratory_entry = ""),
            (self.doctor_template.main_diagnosis = ""),
            (self.doctor_template.complications = ""),
            (self.doctor_template.companion_diagnosis = ""),
            (self.doctor_template.recommendation = ""),
            (self.doctor_template.treatment = ""),
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
        method: "get",
        params: {
          id: self.$cookies.get("user").id
        }
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
        self.data.staff_list[index].patient_complaint =
          response.data.data.patient_complaint;
        self.data.staff_list[index].ilness_history =
          response.data.data.ilness_history;
        self.data.staff_list[index].objective_survey =
          response.data.data.objective_survey;
        self.data.staff_list[index].labaratory_entry =
          response.data.data.labaratory_entry;
        self.data.staff_list[index].main_diagnosis =
          response.data.data.main_diagnosis;
        self.data.staff_list[index].complications =
          response.data.data.complications;
        self.data.staff_list[index].companion_diagnosis =
          response.data.data.companion_diagnosis;
        self.data.staff_list[index].recommendation =
          response.data.data.recommendation;
        self.data.staff_list[index].treatment = response.data.data.treatment;
        self.$bvModal.hide("my-template-" + index);
      });
    },
    PayHistory() {
      let self = this;
      let payment_sum = 0;
      let backlog_sum = 0;
      let discount_sum = parseFloat(self.data.payment_data.discount);
      self.data.payment_list.forEach(function(key, value) {
        payment_sum += parseFloat(key.price);
        backlog_sum += key.price < 0 ? parseFloat(key.price) : 0;
      });

      self.data.payment_data.payment = payment_sum;
      self.data.payment_data.backlog = backlog_sum;
      self.data.payment_data.debt =
        payment_sum +
        discount_sum -
        parseFloat(self.data.payment_data.price_must);
    },
    CheckSumm() {
      let self = this;
      self.pay_datas.price == null
        ? (self.checkSumm = true)
        : (self.checkSumm = false);
    },
    PaySend() {
      let self = this;
      self.CheckSumm();
      if (self.checkSumm == false) {
        self.paySending = true;
        self.pay_datas.price = parseFloat(self.pay_datas.price);
        self.pay_datas.pay_type = self.selected_pay.id;
        self.pay_datas.payType = self.selected_pay;

        self.data.payment_list.push({ ...self.pay_datas });

        self.PayHistory();

        self.pay_datas.price = null;
        self.pay_datas.comment = null;
        self.pay_datas.pay_type = null;
        self.paySending = false;
      }
    },
    DeleteItem(index) {
      let self = this;
      self.data.payment_list.splice(index, 1);
      self.PayHistory();
    },
    CancelPay() {
      let self = this;
      self.CheckSumm();
      if (self.checkSumm == false) {
        self.payCancel = true;

        self.pay_datas.price = -1 * parseFloat(self.pay_datas.price);
        self.pay_datas.pay_type = self.selected_pay.id;
        self.pay_datas.payType = self.selected_pay;

        self.data.payment_list.push({ ...self.pay_datas });

        self.PayHistory();
        self.pay_datas.price = null;
        self.pay_datas.comment = null;
        self.pay_datas.pay_type = null;
        self.payCancel = false;
      }
    },
    CheckOperator() {
      let self = this;
      self.data.staff_id == null
        ? (self.checkOperator = true)
        : (self.checkOperator = false);
    },
    GetOperators() {
      let self = this;

      //get list of operators => operatorlarni olish
      axios({
        url: "staff/operator_list",
        method: "get",
        params: {
          id: localStorage.getItem("branch_id")
        }
      }).then(function(response) {
        self.operators = response.data.data;
      });
    },
    print() {
      let self = this;
      self.CheckOperator();
      if (self.checkOperator == false) {
        self.printing = true;
        self.data.branch_id = localStorage.branch_id;

        if (self.$route.path == "/patient/create") {
          var methods = "post";
          var action = "staff/registration";
          var id = "";
        } else {
          var methods = "post";
          var action = "staff/registration_update";
          var id = self.$route.params.id;
        }
        // console.log(self.data)
        axios({
          url: action,
          method: methods,
          params: {
            id: id
          },
          data: self.data
        }).then(function(response) {
          // console.log(response.data);
          self.printing = false;
          self.$cookies.set("printData", response.data);
          const route = self.$router.resolve({
            path: "/patient/checkprint"
          });
          window.open(route.href, "_blank");
          setTimeout(() => {
            self.$cookies.remove("patient");
            window.close();
          }, 3000);
        });
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
    async showModal() {
      let self = this;
      //tekshiruv bo'limlari ro'yhatini olish
      try {
        const response = await self.axios.get("inspection/section_list");
        self.inspections = response.data.data;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    RemoveIns(index) {
      let self = this;
      self.data.inspection_list.splice(index, 1);
      self.Summa();
    },
    AddInspectionList(index, indexx) {
      let self = this;
      let ins_data = self.inspections[index].children[indexx];
      //tekshiruv jadvalini olish
      axios({
        method: "get",
        url: "inspection/table_list",
        params: {
          id: ins_data.id
        }
      }).then(function(response) {
        ins_data.child_table = response.data.data;
        if (self.$route.path != "/patient/create") {
          ins_data.registration_id = parseInt(self.$route.params.id);
          ins_data.inspection_id = ins_data.id;
        }
        self.data.inspection_list.push({
          ...ins_data
        });
        self.Summa();
      });
      self.modalInspectionShow = false;
    },
    Summa() {
      let self = this;
      let Sum = 0;
      let i = 0;
      self.data.inspection_list.forEach(function(key, value) {
        if (key.chekable == 0) {
          Sum += parseFloat(key.price);
        } else if (key.chekable == 1) {
          self.data.inspection_list[i].child_table.forEach(function(key, value){
            if(key.checked == "1"){
              Sum += parseFloat(key.price);
            }
          });
        }
        i++;
      });
      self.data.room.forEach(function(key, value) {
        Sum += parseFloat(key.price);
      });

      self.data.staff_list.forEach(function(key, value) {
        Sum += parseFloat(key.doctor.section.price);
      });
      
      self.data.payment_data.price_must = Sum;
    },
    AddDoctor(index, indexx, inds) {
      let self = this;
      let doctor = self.doctors[index].section[indexx].staff[inds];
      let doctor_id = self.doctors[index].section[indexx].staff[inds].id;
      doctor.section = self.doctors[index].section[indexx].staff[inds].section;
      self.data.staff_list.push({
        doctor: doctor,
        doctor_id: doctor_id,
        patient_complaint: "",
        ilness_history: "",
        objective_survey: "",
        labaratory_entry: "",
        main_diagnosis: "",
        complications: "",
        companion_diagnosis: "",
        recommendation: "",
        treatment: "",
        table_medicine: []
      });

      self.modalDoctorShow = false;
      self.Summa();
    },
    RemoveDoctor(index) {
      let self = this;
      self.data.staff_list.splice(index, 1);
    },
    Addrow(index) {
      this.data.staff_list[index].table_medicine.push({
        tablet_id: null,
        day: null,
        times: null,
        additional: ""
      });
    },
    RemoveDrug(index, index2) {
      let self = this;
      self.data.staff_list[index].table_medicine.splice(index2, 1);
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
      self.patient_datas.full_name == null
        ? (self.checkName = true)
        : (self.checkName = false);
    },
    CheckGender() {
      let self = this;
      self.patient_datas.gender == null
        ? (self.checkGender = true)
        : (self.checkGender = false);
    },
    SavePatient() {
      let self = this;

      self.CheckName();
      self.CheckGender();
      if (self.checkName == false && self.checkGender == false) {
        self.patient_sending = true;

        if (self.patient_datas.id) {
          var methods = "post";
          var action = "patient/update";
          var id = self.patient_datas.id;
          var msg = "Бемор маълумотлари таҳрирланди!";
        } else {
          var methods = "post";
          var action = "patient/create";
          var id = "";
          var msg = "Бемор маълумотлари сақланди!";
        }

        axios({
          method: methods,
          url: action,
          data: self.patient_datas,
          params: {
            id: id
          }
        }).then(function(response) {
          // console.log(response.data)
          self.patient_sending = false;
          if (response.data.status == true) {
            self.data.patient_id = parseInt(response.data.data.id);
            self.data.patient_name = response.data.data.full_name;
            self.$cookies.set("patient", response.data.data);
            alert(msg);
          }
        });
      }
    },
    async GetPatient() {
      let self = this;
      //bemorlar ro'yhatini olish
      try {
        const response = await self.axios({
          url: "patient/search",
          method: "get",
          params: {
            word: self.filter
          }
        });
        self.patients = response.data.data;
        self.totalRows = self.patients.length;
      } catch (error) {
        self.$store.state.errors = error;
      }
    },
    async GetDoctors() {
      let self = this;
      //shifokorlar ro'yhatini olish
      try {
        const response = await self.axios.get("staff/select");
        self.doctors = response.data.data;
        self.Summa();
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
      self.Summa();
      self.modalRoomShow = false;
    },
    RemoveRoom(index) {
      let self = this;
      self.data.room.splice(index, 1);
      self.Summa();
    },
    async GetDrug() {
      let self = this;
      //dorilar ro'yhatini olish
      try {
        const response = await self.axios.get("universal/tablet_list");
        self.drugs = response.data.data;
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
    AddPatient(item) {
      let self = this;
      //get patient => bemor ma'lumotlarini olish
      axios({
        url: "patient/index",
        method: "get",
        params: {
          id: item.id
        }
      }).then(function(response) {
        // console.log(response.data.data)
        self.modalPatientShow = false;
        self.patient_datas = response.data.data;
        self.patient_datas.birth_date = response.data.data.birth_date.toString();
        self.GetRegions();
        self.GetDistricts();
        self.GetQuarters();
        self.data.patient_name = response.data.data.full_name;
        self.data.patient_id = response.data.data.id;
      });
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
          self.patient_datas.birth_date = response.data.data.birth_date.toString();
          self.GetRegions();
          self.GetDistricts();
          self.GetQuarters();
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
    GetRegions() {
      let self = this;
      //get list of regions => viloyatlar ro'yhatinini olish
      axios.get("universal/region_list").then(function(response) {
        self.regions = response.data.data;
      });
    },
    GetDistricts() {
      let self = this;
      //get list of districts => tumanlar ro'yhatinini olish
      if (self.patient_datas.region_id != null) {
        axios({
          method: "get",
          url: "universal/district_list",
          params: {
            id: self.patient_datas.region_id
          }
        }).then(function(response) {
          self.districts = response.data.data;
        });
      }
    },
    GetQuarters() {
      let self = this;
      //get list of quarters => mahallalar ro'yhatini olish
      if (self.patient_datas.district_id != null) {
        axios({
          method: "get",
          url: "universal/quarter_list",
          params: {
            id: self.patient_datas.district_id
          }
        }).then(function(response) {
          self.mahallas = response.data.data;
        });
      }
    },
    onFileSelected(event) {
      var reader,
        files = event.target.files;
      reader = new FileReader();
      reader.onload = event => {
        this.selectedFile = event.target.result;
      };
      reader.readAsDataURL(files[0]);
      console.log(event);
      // this.selectedFile = event.target.files[0].name
      // console.log(this.$refs.file_0[0].files[0].name);

      // console.log(this.$refs.file_0[0].files.FileList)
      // this.data.inspection_list[index].child_table[indeks].file = this.$refs.file_0[0].files.FileList
      // for(const [key, value] of Object.entries(foo)){
      //   if(key != 'my-modal'){
      //     // console.log(`${key} : ${value}`);
      //   console.log(value);
      //   // console.log(this.$refs.key.files);

      //     // for(let i=0; i < value.files.length; i ++){
      //     //   let my_foo = value.files[i];
      //     //   // console.log(my_foo)
      //     //   formData.append('files['+i+']', my_foo);
      //     // }
      //   }
      // }
    },
    onUpload() {
      const fd = new FormData();
      fd.append("image", this.selectedFile, this.selectedFile.name);
      axios.post("", fd).then(res => {
        console.log(res);
      });
    },
    onImageSelected(indeks) {
      this.images.push(this.$refs);
      console.log(this.images);
      this.url = URL.createObjectURL(this.$refs.images[indeks].files[0]);
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
  width: 100% !important;
  max-width: 100% !important;
  min-height: 100% !important;
  background-color: #d1e5f1 !important;
  /* background-image: linear-gradient(
    to top,
    rgba(202, 111, 86, 0.84),
    rgba(88, 135, 206, 0.534)
  ) !important; */
  /* margin-bottom: 10px; */
  padding: 8px 15px;
  height: 100% !important;
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
