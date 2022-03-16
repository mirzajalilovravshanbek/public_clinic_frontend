<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <!-- <h3 class="md-title">{{ $route.name }}</h3> -->
        <h3 class="md-title">{{ username }}</h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <md-list>
            <li class="md-list-item lang-item" @click="switchLocale('uz')">
              <div class="md-list-item-content">
                ЎЗБ
              </div>
            </li>
            <li class="md-list-item lang-item" @click="switchLocale('ru')">
              <div class="md-list-item-content">
                РУС
              </div>
            </li>
            <md-list-item
              href="#/dashboard"
              target="_blank"
              id="dashboard-tooltip"
            >
              <b-icon icon="columns-gap" font-scale="1.5"></b-icon>
              <p class="hidden-lg hidden-md">{{ $t("Навбат") }}</p>
              <b-tooltip target="dashboard-tooltip" variant="dark">{{
                $t("Навбат")
              }}</b-tooltip>
            </md-list-item>

            <li class="md-list-item">
              <div class="md-list-item-content">
                <md-button
                  slot="title"
                  class="md-button md-just-icon md-simple"
                  @click="Logout()"
                  id="logout-tooltip"
                >
                  <p class="mt-3">
                    <b-icon icon="box-arrow-in-right" font-scale="1.8"></b-icon>
                  </p>
                  <p class="hidden-lg hidden-md">{{ $t("Чиқиш") }}</p>
                  <b-tooltip target="logout-tooltip" variant="dark">{{
                    $t("Чиқиш")
                  }}</b-tooltip>
                </md-button>
              </div>
            </li>

            <!-- <md-list-item href="#/user">
              <b-icon icon="person-fill" font-scale="1.8"></b-icon>
              <p class="hidden-lg hidden-md">Profile</p>
            </md-list-item> -->
          </md-list>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
export default {
  data() {
    return {
      username: null
    };
  },
  beforeCreate() {
    if (!localStorage.getItem("t")) {
      this.$router.push("/loginuser");
    }
    this.$i18n.locale = this.$store.state.lang;
  },
  mounted() {
    this.username = localStorage.getItem("username");
  },
  methods: {
    switchLocale(locale) {
      if (this.$i18n.locale !== locale) {
        this.$i18n.locale = locale;
        this.$store.state.lang = locale;
      }
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    Logout() {
      localStorage.removeItem("t");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("oid");
      localStorage.removeItem("did");
      this.$router.push("/loginuser");
    }
  }
};
</script>

<style lang="css">
.lang-item {
  cursor: pointer;
  text-transform: uppercase;
  font-size: 18px;
  display: inline;
  width: 30px;
  margin: 0 8px;
}
</style>
