<template>
  <b-container fluid class="all-div-height">
    <b-row>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50"
      >
        <router-link :to="{ path: '/reports/inspectionxisobot' }">
          <stats-card data-background-color="green">
            <template slot="header">
              <b-iconstack font-scale="4">
                <b-icon
                  stacked
                  icon="list-check"
                  scale="0.60"
                  shift-v="-1"
                ></b-icon>
                <b-icon stacked icon="clipboard"></b-icon>
              </b-iconstack>
            </template>

            <template slot="content">
              <h5 class="title">Текширувлар Ҳисоботи</h5>
            </template>
          </stats-card>
        </router-link>
      </div>

      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50"
      >
        <router-link :to="{ path: '/reports/employeesxisobot' }">
          <stats-card data-background-color="blue">
            <template slot="header">
              <b-icon icon="person-check" font-scale="4"></b-icon>
            </template>

            <template slot="content">
              <h5 class="title">Ходим Ҳисоботи</h5>
            </template>
          </stats-card>
        </router-link>
      </div>

      <!-- <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-33"
      >
        <router-link :to="{ path: '/reports/kassa' }">
          <stats-card data-background-color="blue">
            <template slot="header">
              <b-icon icon="journal-text" font-scale="4"></b-icon>
            </template>

            <template slot="content">
              <h5 class="title">Касса Китоби</h5>
            </template>
          </stats-card>
        </router-link>
      </div> -->
    </b-row>
    <!-- <b-row>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-33"
      >
        <router-link to="{ path: '/reports/reagentxodimxisobot' }">
          <stats-card data-background-color="blue">
            <template slot="header">
              <b-icon icon="tools" font-scale="4"></b-icon>
            </template>

            <template slot="content">
              <h5 class="title">Реагент Ходим Ҳисоботи</h5>
            </template>
          </stats-card>
        </router-link>
      </div>

      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-33"
      >
        <router-link to="{ path: '/reports/providerxisobot' }">
          <stats-card data-background-color="blue">
            <template slot="header">
              <b-icon icon="truck" font-scale="4"></b-icon>
            </template>

            <template slot="content">
              <h5 class="title">Поставщик Ҳисоботи</h5>
            </template>
          </stats-card>
        </router-link>
      </div>

      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-33"
      >
        <router-link to="{ path: '/reports/registration' }">
          <stats-card data-background-color="green">
            <template slot="header">
              <b-iconstack font-scale="4">
                <b-icon
                  stacked
                  icon="list-check"
                  scale="0.60"
                  shift-v="-1"
                ></b-icon>
                <b-icon stacked icon="clipboard"></b-icon>
              </b-iconstack>
            </template>

            <template slot="content">
              <h5 class="title">Регистрация Сверкаси</h5>
            </template>
          </stats-card>
        </router-link>
      </div>
    </b-row> -->
    <b-row> </b-row>
  </b-container>
</template>
<script>
import { StatsCard } from "@/components";

export default {
  components: {
    StatsCard
  },
  mounted() {
    // localStorage.clear();
  }
};
</script>
