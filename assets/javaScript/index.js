////////////////
/// index.js ///
////////////////


$(document).ready(function() {
    
    
    var cityList = JSON.parse(localStorage.getItem("cityList")) || [];
    var owmAPIkey = "c0c4b29098bdb76042394a260bb65fc1";
    var searchedCity;
    var curr_date = moment().format("MM/DD/YYYY");
    var curr_day = moment().format("DD");
    var curr_month = moment().format("MM");
    var curr_year = moment().format("YYYY");
    
    console.log("index.js connected!");




    // Render City List on function called and load
    var renderCityList = function() {

        $("#city_list").empty();

        var cityListStored = JSON.parse(localStorage.getItem("cityList")) || [];
    
        
        if(cityListStored.length === 0) {
            console.log("No cities currently selected.");
        }
        
    
        for(var i = 0; i < cityListStored.length; i++) {
    
            var city = cityListStored[i];
            var newLI = $("<li></li>").text(city);
            $(newLI).appendTo("#city_list");
    
        }
    }
    
    renderCityList();
    
    $("form").on("submit", function(event) {
        event.preventDefault();
        searchedCity = $("#searched_city").val().trim();
        searchCity();
    });
    
    // Function and Event Listener to store the new city searched
    var searchCity = function() {
        
        cityList = JSON.parse(localStorage.getItem("cityList")) || [];
    
        //event.preventDefault();
        
        // replaced $("#searched_city").val() with searchedCity
        if(searchedCity === "") {
            console.log("Empty Search!");
            return;
        }
    
        console.log($("#searched_city").val());
    
        //var searchedCity = $("#searched_city").val().trim();
        //searchedCity = $("#searched_city").val().trim();
    
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&appid=" + owmAPIkey;
        // Forecast link doesn't work
        //var queryURL = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + searchedCity + "&cnt=5&appid=cff2f93f1e55f9fe1fc2c661e054c2d9";

        console.log("Query URL = " + queryURL);

        // WORK ON THIS NEXT AND ADD FUNCTIONALITY TO THE SEARCHWEATHERDATA FUNCTION

        $.ajax({
            url: queryURL,
            method: "GET",
            error: function(err) {
                console.log(err.status + " " + err.statusText);
            }
        }).then(searchWeatherData);
    
    };
    
    /*
    $("form").on("submit", function(event) {
        event.preventDefault();
        searchedCity = $("#searched_city").val().trim();
        searchCity();
    }
    
    );
    */
    
    var searchWeatherData = function(owmData) {

        console.log(owmData);
        console.log("city name = " + owmData.name);
        searchedCity = owmData.name;

        var iconURL = "http://openweathermap.org/img/w/" + owmData.weather[0].icon + ".png";


        
        console.log(curr_date);

        $("#city_selected").html(searchedCity + " (" + curr_date + ") <img src='" + iconURL  + "'>");
        // Converting Temperature from Kelvin to Fahrenheit
        $("#selected_temp").html((((owmData.main.temp - 273.15) * 1.80) + 32).toFixed(2) + " °F");
        $("#selected_humid").html(owmData.main.humidity + "%");
        $("#selected_wind").html(owmData.wind.speed + " MPH");

        // Remaining Weather data is exracted from OWM OneCall API using the coordinates from city forecast data
        var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + owmData.coord.lat + "&lon=" + owmData.coord.lon + "&appid=" + owmAPIkey;
        console.log("oneCallURL = " + oneCallURL);

        $.ajax({
            url: oneCallURL,
            method: "GET",
            error: function(err) {
                console.log(err.status + " " + err.statusText);
            }
        }).then(searchForecast);



        saveCity();

    };

    var searchForecast = function(forecastData) {
        console.log(forecastData);

        var uvIndex = forecastData.current.uvi;

        $("#selected_UV").html(uvIndex);

        // Sytling and adding color to UV index according to score
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
        


        $("#day1").html(curr_month + "/" + (parseInt(curr_day) + 1) + "/" + curr_year);
        $("#day2").html(curr_month + "/" + (parseInt(curr_day) + 2) + "/" + curr_year);
        $("#day3").html(curr_month + "/" + (parseInt(curr_day) + 3) + "/" + curr_year);
        $("#day4").html(curr_month + "/" + (parseInt(curr_day) + 4) + "/" + curr_year);
        $("#day5").html(curr_month + "/" + (parseInt(curr_day) + 5) + "/" + curr_year);

        $("#day1_icon").html("<img src='http://openweathermap.org/img/w/" + forecastData.daily[1].weather[0].icon + ".png'>");
        $("#day2_icon").html("<img src='http://openweathermap.org/img/w/" + forecastData.daily[2].weather[0].icon + ".png'>");
        $("#day3_icon").html("<img src='http://openweathermap.org/img/w/" + forecastData.daily[3].weather[0].icon + ".png'>");
        $("#day4_icon").html("<img src='http://openweathermap.org/img/w/" + forecastData.daily[4].weather[0].icon + ".png'>");
        $("#day5_icon").html("<img src='http://openweathermap.org/img/w/" + forecastData.daily[5].weather[0].icon + ".png'>");

        $("#day1_temp").html("Temp: " + (((forecastData.daily[1].temp.day - 273.15) * 1.80) + 32).toFixed(2) + " °F");
        $("#day2_temp").html("Temp: " + (((forecastData.daily[2].temp.day - 273.15) * 1.80) + 32).toFixed(2) + " °F");
        $("#day3_temp").html("Temp: " + (((forecastData.daily[3].temp.day - 273.15) * 1.80) + 32).toFixed(2) + " °F");
        $("#day4_temp").html("Temp: " + (((forecastData.daily[4].temp.day - 273.15) * 1.80) + 32).toFixed(2) + " °F");
        $("#day5_temp").html("Temp: " + (((forecastData.daily[5].temp.day - 273.15) * 1.80) + 32).toFixed(2) + " °F");

        $("#day1_humid").html("Humidity: " + forecastData.daily[1].humidity + "%");
        $("#day2_humid").html("Humidity: " + forecastData.daily[2].humidity + "%");
        $("#day3_humid").html("Humidity: " + forecastData.daily[3].humidity + "%");
        $("#day4_humid").html("Humidity: " + forecastData.daily[4].humidity + "%");
        $("#day5_humid").html("Humidity: " + forecastData.daily[5].humidity + "%");

    }



    var saveCity = function() {

        cityList = JSON.parse(localStorage.getItem("cityList")) || [];

    
        //var searchedCity = $("#searched_city").val().trim();


        if(cityList.indexOf(searchedCity) > -1) {
            return;
        }
        else {

            cityList.unshift(searchedCity);
            cityList.splice(7);
        
            localStorage.setItem("cityList", JSON.stringify(cityList));
        
            renderCityList();
        }

    }




    // FUNCTION CALLS
    
    // Search weather on startup for the most recently searched city
    if(cityList.length > 0) {
        searchedCity = cityList[0];
        searchCity();
    }

    // When the user clicks on a city from recent search history list
    $("#city_list").on("click", function(event){

        console.log("Click works.");
        console.log($(event.target).text());
        searchedCity = $(event.target).text();
        searchCity();

    });

});




// BONUS: Create a clear button to clear out the searched cities and reloads
// If there are no no current search results, hide the forecast and clear button