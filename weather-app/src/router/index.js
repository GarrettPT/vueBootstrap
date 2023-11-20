// Description: The main router for our application. Right now provides two routes for our application to hit. 
// Author: Garrett Pement
import Vue from "vue";
import router from "vue-router";
import WeatherSearchVue from "@/components/WeatherSearch.vue";
import ReportsView from "@/components/ReportsView.vue";

Vue.use(router);

export default new router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: WeatherSearchVue,
    },
    {
      path: "/reports",
      name: "Reports",
      component: ReportsView,
    },
  ],
  mode: "history",
});
