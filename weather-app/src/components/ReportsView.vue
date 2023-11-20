<!-- 
  Description: Integration and display of chartJS for Vue. This utilizes our saved search data to build and display various data points from our weather search history
  Author: Garrett Pement
 -->
<template>
  <div class="container-fluid">
    <b-row style="margin-top: 15px">
      <b-col md="12" class="graphContainer">
        <Doughnut
          :data="weatherData"
          :options="weatherOptions"
          v-if="weatherHistory.length !== 0"
        />
      </b-col>
      <b-col md="12" class="graphContainer">
        <Doughnut
          :data="cityData"
          :options="cityOptions"
          v-if="weatherHistory.length !== 0"
        />
      </b-col>
    </b-row>

    <b-modal ref="error-modal" hide-footer title="No Search History Found">
      <div class="d-block text-center">
        <p>
          It appears you have not searched for any weather reports. Would you
          like go return to the search page?
        </p>
      </div>
      <b-button class="mt-3" variant="info" block :to="'/'">Yes</b-button>
      <b-button class="mt-2" block @click="hideModal">No</b-button>
    </b-modal>
  </div>
</template>

<script>
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Colors,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Colors
);

export default {
  data() {
    return {
      weatherHistory: [],
      weatherOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Searched Weather Distribution",
            fullsize: true,
          },
        },
      },
      cityOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Searched Cities Distribution",
            fullsize: true,
          },
        },
      },
    };
  },
  components: { Doughnut },
  mounted() {
    if (localStorage.weatherHistory !== undefined) {
      this.setHistory(JSON.parse(localStorage.weatherHistory));
    } else {
      this.showModal();
    }
  },
  methods: {
    setHistory(data) {
      this.weatherHistory = data;
    },
    showModal() {
      this.$refs["error-modal"].show();
    },
    hideModal() {
      this.$refs["error-modal"].hide();
    },
  },
  computed: {
    weatherData() {
      if (localStorage.weatherHistory !== undefined) {
        const weatherArray = JSON.parse(localStorage.weatherHistory);
        const uniqueKeys = [
          ...new Set(weatherArray.map((item) => item.weather)),
        ];
        let dataSet = [];

        uniqueKeys.forEach((key) =>
          dataSet.push(weatherArray.filter((obj) => obj.weather === key).length)
        );

        let returnData = { labels: uniqueKeys, datasets: [{ data: dataSet }] };

        return returnData;
      } else {
        return [];
      }
    },
    cityData() {
      if (this.weatherHistory !== undefined) {
        const cityArray = this.weatherHistory;
        const uniqueKeys = [...new Set(cityArray.map((item) => item.location))];
        let dataSet = [];

        uniqueKeys.forEach((key) =>
          dataSet.push(cityArray.filter((obj) => obj.location === key).length)
        );

        let returnData = { labels: uniqueKeys, datasets: [{ data: dataSet }] };

        return returnData;
      } else {
        return [];
      }
    },
  },
};
</script>

<style>
.graphContainer {
  min-height: 600px;
}
</style>
