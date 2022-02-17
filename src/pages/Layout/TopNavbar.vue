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
            <md-list-item href="#/" id="dashboard-tooltip">
              <b-icon icon="columns-gap" font-scale="1.5"></b-icon>
              <p class="hidden-lg hidden-md">Dashboard</p>
              <b-tooltip target="dashboard-tooltip" variant="dark"
                >Навбат</b-tooltip
              >
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
                  <p class="hidden-lg hidden-md">Чиқиш</p>
                  <b-tooltip target="logout-tooltip" variant="dark"
                    >Чиқиш</b-tooltip
                  >
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
      username: null,
      selectedEmployee: null,
      employees: [
        "Jim Halpert",
        "Dwight Schrute",
        "Michael Scott",
        "Pam Beesly",
        "Angela Martin",
        "Kelly Kapoor",
        "Ryan Howard",
        "Kevin Malone"
      ]
    };
  },
  beforeCreate() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/loginuser");
    }
  },
  mounted() {
    this.username = localStorage.getItem("username");
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    Logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      this.$router.push("/loginuser");
    }
  }
};
</script>

<style lang="css"></style>
