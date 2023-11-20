<!-- 
  Description: The Navigation and router link integration for our application. 
  Author: Garrett Pement
 -->
<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="navBarBlue">
      <b-container fluid>
        <b-navbar-brand href="#">Weather Checker </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item
              active-class="active"
              class="nav-link"
              v-for="routes in Links"
              :key="routes.id"
              :to="routes.path"
              exact
            >
              {{ routes.name }}
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <template slot="button-content"><em>User</em></template>
              <b-dropdown-item href="#">Profile</b-dropdown-item>
              <b-dropdown-item href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Links: [
        {
          id: 0,
          name: "Home",
          path: "/",
        },
        {
          id: 1,
          name: "Reports",
          path: "/reports",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style>
.navBarBlue {
  background-color: #122c3d !important;
}
</style>
