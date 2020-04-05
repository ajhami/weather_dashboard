////////////////
/// index.js ///
////////////////


$(document).ready(function() {
    
    
    var cityList = JSON.parse(localStorage.getItem("cityList")) || [];
    var owmAPIkey = "c0c4b29098bdb76042394a260bb65fc1";
    var searchCity;
    
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
        
        if($("#searched_city").val() === "") {
            console.log("Empty Search!");
            return;
        }
    
        console.log($("#searched_city").val());
    
        //var searchedCity = $("#searched_city").val().trim();
        //searchedCity = $("#searched_city").val().trim();
    
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&appid=" + owmAPIkey;

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



        saveCity();

    };



    var saveCity = function() {

        cityList = JSON.parse(localStorage.getItem("cityList")) || [];

    
        //var searchedCity = $("#searched_city").val().trim();

        cityList.unshift(searchedCity);
        cityList.splice(7);
    
        localStorage.setItem("cityList", JSON.stringify(cityList));
    
        renderCityList();
    }





});




// BONUS: Create a clear button to clear out the searched cities and reloads
// If there are no no current search results, hide the forecast and clear button