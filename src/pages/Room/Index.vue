<template>
  <b-container fluid class="all-div-height">
    <b-row>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50"
      >
        <router-link :to="{ path: '/room/doctorroom/index' }">
          <stats-card data-background-color="blue">
            <template slot="header">
              <b-iconstack font-scale="4">
                <b-icon
                  stacked
                  icon="person-bounding-box"
                  scale="0.60"
                  shift-v="-1"
                ></b-icon>
                <b-icon stacked icon="clipboard"></b-icon>
              </b-iconstack>
            </template>

            <template slot="content">
              <h5 class="title">Шифокор Хоналари</h5>
            </template>
          </stats-card>
        </router-link>
      </div>

      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50"
      >
        <router-link :to="{ path: '/room/patientroom/index' }">
          <stats-card data-background-color="blue">
            <template slot="header">
              <b-icon icon="person-check" font-scale="4"></b-icon>
            </template>

            <template slot="content">
              <h5 class="title">Бемор Хоналари</h5>
            </template>
          </stats-card>
        </router-link>
      </div>
    </b-row>
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
