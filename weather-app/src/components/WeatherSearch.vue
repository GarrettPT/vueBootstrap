<!-- 
  Description: The landing page and search functionality for our weather app. This utilizes the openweathermap.org api to search for weather from various cities. We then have that weather stored in a local variable in our browser to display and build our table data. Error handling and data clearing is also available from this page.
  Author: Garrett Pement. 
 -->
<template>
  <div class="container-fluid">
    <b-row>
      <b-col lg="4">
        <div class="weather-container">
          <div class="weather-wrap">
            <div class="search-box">
              <input
                type="text"
                placeholder="Search by City..."
                class="search-bar"
                v-model="query"
                v-on:keypress="fetchWeather"
              />
            </div>
            <div
              class="weather-info"
              v-if="typeof weather.main !== 'undefined'"
            >
              <div class="location-box">
                <div class="location">
                  {{ weather.name }} , {{ weather.sys.country }}
                </div>
                <div class="date">{{ todaysDate() }}</div>
              </div>
              <div class="weather-box">
                <div class="temp">{{ Math.round(weather.main.temp) }}°F</div>
                <div class="weather">{{ weather.weather[0].main }}</div>
                <div class="icon">
                  <img
                    :src="`${weather_icon}${
                      weather.weather[0].icon
                    }${'@2x.png'}`"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-col>

      <b-col lg="8">
        <!-- Displays the search history in a responsive table -->
        <div>
          <b-table
            :items="items"
            :fields="fields"
            :sticky-header="'800px'"
            striped
            responsive="sm"
            class="weatherTable"
          >
            <template #cell(temp)="{ item }">
              <p>{{ item.temp }}°F</p>
            </template>
          </b-table>
          <b-button
            variant="info"
            class="downloadExcelButton"
            @click="downloadExcel"
            >Download History</b-button
          >
          <b-button variant="danger" class="clearButton" @click="showModal"
            >Clear History</b-button
          >
        </div>
      </b-col>
    </b-row>

    <b-modal ref="confirm-modal" hide-footer title="Clear Search History">
      <div class="d-block text-center">
        <p>Are you sure you want to delete your search history?</p>
      </div>
      <b-button class="mt-3" variant="danger" block @click="clearHistory"
        >Yes</b-button
      >
      <b-button class="mt-2" variant="warning" block @click="hideModal"
        >No</b-button
      >
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      api_key: "27bcc252742830381afd6856832da01a",
      url_base: "https://api.openweathermap.org/data/2.5/",
      weather_icon: "http://openweathermap.org/img/wn/",
      query: "",
      weather: {},
      fields: [
        { key: "date", label: "Date" },
        { key: "location", label: "Location" },
        { key: "temp", label: "Temperature (°F)" },
        { key: "weather", label: "Weather" },
      ],
      items: [],
    };
  },
  mounted() {
    if (localStorage.weatherHistory) {
      this.items = JSON.parse(localStorage.weatherHistory);
    }
  },
  methods: {
    MakeToast(error) {
      // Creates a dynamic error Toast with the error message.
      this.$bvToast.toast(
        `There has been an error: ${error.response.data.message}`,
        {
          title: "Error",
          solid: true,
          variant: "danger",
          autoHideDelay: 10000,
        }
      );
    },
    setResults(response) {
      this.weather = response;
    },
    // Creates another weather entry into our history variable. It also sets the new weather history in our local storage value
    setItems(response) {
      this.items.push({
        isActive: false,
        date: this.todaysDate(),
        temp: Math.round(response.main.temp),
        weather: response.weather[0].main,
        location: `${response.name}, ${response.sys.country}`,
      });
      localStorage.weatherHistory = JSON.stringify(this.items);
    },
    clearHistory() {
      localStorage.removeItem("weatherHistory");
      this.items = [];
      this.hideModal();
    },
    todaysDate() {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let d = new Date();
      let month = months[d.getMonth()];
      let day = days[d.getDay()];
      let date = d.getDate();
      let year = d.getFullYear();
      return `${month} ${date} ${day} ${year}`;
    },
    async fetchWeather(e) {
      // Fetch our weather data
      if (e.key == "Enter") {
        await axios
          .get(
            `${this.url_base}weather?q=${this.query}&units=imperial&APPID=${this.api_key}`
          )
          .then((response) => {
            this.setResults(response.data);
            this.setItems(response.data);
          })
          .catch((error) => {
            if (error) {
              this.MakeToast(error);
            }
          });
      }
    },
    showModal() {
      this.$refs["confirm-modal"].show();
    },
    hideModal() {
      this.$refs["confirm-modal"].hide();
    },
    downloadExcel() {
      // Encodes CSV for history download.
      let headers = ["date", "location", "temp", "weather"];
      const seperator = ";";

      const csv = [
        headers.join(seperator),
        ...this.items.map((row) =>
          headers.map((field) => `${row[field]}`).join(seperator)
        ),
      ];

      let csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
      var encodedUri = encodeURI(csvContent);

      // Doesn't work on chrome due to adblock popup settings. For demonstration use in firefox.
      window.open(encodedUri);
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700;900&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Montserrat";
}
.weather-container {
  background-image: url("../assets/weatherBackground.png");
  background-size: cover;
  background-position: center;
  transition: 0.4s;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 15px;
  border-radius: 25px;
  margin-top: 50px;
  box-shadow: 0px 0px 30px #00000065;
  max-width: 500px;
}
.weather-wrap {
  min-height: 600px;
  padding: 25px;
  border-radius: 25px;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.4)
  );
  margin: auto;
}
.search-box .search-bar {
  display: block;
  width: 100%;
  padding: 15px;
  color: #313131;
  font-size: 20px;
  appearance: none;
  border: none;
  outline: none;
  background: none;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  transition: 0.4s;
}
.search-box .search-bar:focus {
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.75);
}
.location-box .location {
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  font-style: italic;
  text-align: center;
  margin-top: 30px;
}
.location-box .date {
  color: #fff;
  font-size: 20px;
  font-weight: 300;
  text-align: center;
}
.weather-box {
  text-align: center;
}
.weather-box .temp {
  display: inline-block;
  padding: 10px 25px;
  color: #fff;
  font-size: 102px;
  font-weight: 900;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  margin: 30px 0px;
  box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  font-style: italic;
}
.weather-box .weather {
  color: #fff;
  font-size: 48px;
  font-weight: 700;
  font-style: italic;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}
.weatherTable {
  margin-top: 15px;
}
.clearButton {
  float: right;
  margin-top: 15px;
}
.downloadExcelButton {
  float: left;
  margin-top: 15px;
}
</style>
