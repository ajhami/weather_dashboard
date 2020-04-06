////////////////
/// index.js ///
////////////////


    
//Global Variables

var cityList = JSON.parse(localStorage.getItem("cityList")) || [];
var owmAPIkey = "c0c4b29098bdb76042394a260bb65fc1";
var searchedCity;
var curr_date = moment().format("MM/DD/YYYY");
var curr_day = moment().format("DD");
var curr_month = moment().format("MM");
var curr_year = moment().format("YYYY");



// FUNCTIONS

// Render City List on function called and load
var renderCityList = function() {

    $("#city_list").empty();

    var cityListStored = JSON.parse(localStorage.getItem("cityList")) || [];

    if(cityListStored.length === 0) {
        return;
    }
    
    for(var i = 0; i < cityListStored.length; i++) {

        var city = cityListStored[i];
        var newLI = $("<li></li>").text(city);
        $(newLI).appendTo("#city_list");

    }
}


// Function to search for city weather data
var searchCity = function() {
    
    // Exit if blank entry is submitted
    if(searchedCity === "") {
        return;
    }

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&appid=" + owmAPIkey;

    // API call
    $.ajax({
        url: queryURL,
        method: "GET",
        error: function(err) {
            console.log(err.status + " " + err.statusText);
        }
    }).then(searchWeatherData);

};


// Searches for current day wheather data as well as needed coordinances for next ajax call
var searchWeatherData = function(owmData) {

    // Setting the currently searched city to offical name found through OWM
    searchedCity = owmData.name;

    // Adding data to html
    var iconURL = "http://openweathermap.org/img/w/" + owmData.weather[0].icon + ".png";
    $("#city_selected").html(searchedCity + " (" + curr_date + ") <img src='" + iconURL  + "'>");
    // Converting Temperature from Kelvin to Fahrenheit
    $("#selected_temp").html((((owmData.main.temp - 273.15) * 1.80) + 32).toFixed(2) + " °F");
    $("#selected_humid").html(owmData.main.humidity + "%");
    $("#selected_wind").html(owmData.wind.speed + " MPH");

    // Remaining Weather data is extracted from OWM OneCall API using the coordinates from city forecast data
    var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + owmData.coord.lat + "&lon=" + owmData.coord.lon + "&appid=" + owmAPIkey;

    // API call
    $.ajax({
        url: oneCallURL,
        method: "GET",
        error: function(err) {
            console.log(err.status + " " + err.statusText);
        }
    }).then(searchForecast);

};


// Searches for UVI and Forecast Data and displays to HTML
var searchForecast = function(forecastData) {

    var uvIndex = forecastData.current.uvi;
    // Displaying current UVI
    $("#selected_UV").html(uvIndex);

    // Styling and adding color to UV index according to score
    $("#selected_UV").css("border", "1px solid #000000");
    $("#selected_UV").css("padding", "0.5rem");
    $("#selected_UV").css("border-radius", "1.0rem");
    $("#selected_UV").css("color", "#ffffff");
    if(uvIndex < 1) {
        $("#selected_UV").css("background-color", "#008000");
    }
    else if(uvIndex < 2) {
        $("#selected_UV").css("background-color", "#0a8d0a");
    }
    else if(uvIndex < 3) {
        $("#selected_UV").css("background-color", "#3e8d0a");
    }
    else if(uvIndex < 4) {
        $("#selected_UV").css("background-color", "#5f8d0a");
    }
    else if(uvIndex < 5) {
        $("#selected_UV").css("background-color", "#9bb314");
    }
    else if(uvIndex < 6) {
        $("#selected_UV").css("background-color", "#d1ce23");
    }
    else if(uvIndex < 7) {
        $("#selected_UV").css("background-color", "#d1b723");
    }
    else if(uvIndex < 8) {
        $("#selected_UV").css("background-color", "#d89417");
    }
    else if(uvIndex < 9) {
        $("#selected_UV").css("background-color", "#d1760d");
    }
    else if(uvIndex < 10) {
        $("#selected_UV").css("background-color", "#d1340d");
    }
    else {
        $("#selected_UV").css("background-color", "#d10d0d");
    }
    
    // Adding dates for future forcasts
    $("#day1").html(curr_month + "/" + (parseInt(curr_day) + 1) + "/" + curr_year);
    $("#day2").html(curr_month + "/" + (parseInt(curr_day) + 2) + "/" + curr_year);
    $("#day3").html(curr_month + "/" + (parseInt(curr_day) + 3) + "/" + curr_year);
    $("#day4").html(curr_month + "/" + (parseInt(curr_day) + 4) + "/" + curr_year);
    $("#day5").html(curr_month + "/" + (parseInt(curr_day) + 5) + "/" + curr_year);

    // Adding forecasted weather icon
    $("#day1_icon").html("<img src='http://openweathermap.org/img/w/" + forecastData.daily[1].weather[0].icon + ".png'>");
    $("#day2_icon").html("<img src='http://openweathermap.org/img/w/" + forecastData.daily[2].weather[0].icon + ".png'>");
    $("#day3_icon").html("<img src='http://openweathermap.org/img/w/" + forecastData.daily[3].weather[0].icon + ".png'>");
    $("#day4_icon").html("<img src='http://openweathermap.org/img/w/" + forecastData.daily[4].weather[0].icon + ".png'>");
    $("#day5_icon").html("<img src='http://openweathermap.org/img/w/" + forecastData.daily[5].weather[0].icon + ".png'>");

    // Adding forecasted temperature
    $("#day1_temp").html("Temp: " + (((forecastData.daily[1].temp.day - 273.15) * 1.80) + 32).toFixed(2) + " °F");
    $("#day2_temp").html("Temp: " + (((forecastData.daily[2].temp.day - 273.15) * 1.80) + 32).toFixed(2) + " °F");
    $("#day3_temp").html("Temp: " + (((forecastData.daily[3].temp.day - 273.15) * 1.80) + 32).toFixed(2) + " °F");
    $("#day4_temp").html("Temp: " + (((forecastData.daily[4].temp.day - 273.15) * 1.80) + 32).toFixed(2) + " °F");
    $("#day5_temp").html("Temp: " + (((forecastData.daily[5].temp.day - 273.15) * 1.80) + 32).toFixed(2) + " °F");

    // Adding forecasted humidity
    $("#day1_humid").html("Humidity: " + forecastData.daily[1].humidity + "%");
    $("#day2_humid").html("Humidity: " + forecastData.daily[2].humidity + "%");
    $("#day3_humid").html("Humidity: " + forecastData.daily[3].humidity + "%");
    $("#day4_humid").html("Humidity: " + forecastData.daily[4].humidity + "%");
    $("#day5_humid").html("Humidity: " + forecastData.daily[5].humidity + "%");

    saveCity();

};


// Saves searched city not found in recent search history to the list
var saveCity = function() {

    cityList = JSON.parse(localStorage.getItem("cityList")) || [];

    // If the searched city is already found in our list, we want to skip adding it to our array
    if(cityList.indexOf(searchedCity) > -1) {
        return;
    }
    else {
        cityList.unshift(searchedCity);
        // Only keeping recent seven searches in searched list
        cityList.splice(7);
    
        localStorage.setItem("cityList", JSON.stringify(cityList));
    
        renderCityList();
    }
};



// FUNCTION CALLS

// On Startup:
// Load localStorage to our recent search list on startup
renderCityList();
// and search weather for the most recently searched city
if(cityList.length > 0) {
    searchedCity = cityList[0];
    searchCity();
}

// Event Listener when user is searching for a city in the search bar
$("form").on("submit", function(event) {
    event.preventDefault();
    searchedCity = $("#searched_city").val().trim();
    searchCity();
});

// Event Listener when the user clicks on a city from recent search history list
$("#city_list").on("click", function(event){
    searchedCity = $(event.target).text();
    searchCity();
});

// Event Listener to clear the search history and refresh the page
$(".clear_button").on("click", function(event){
    event.preventDefault();
    var wantToClear = confirm("Are you sure you want to clear your search history?");

    if(!wantToClear) {
        return;
    }
    else {
        localStorage.clear();
        location.reload();
    }
});

