////////////////
/// index.js ///
////////////////

var cityList = JSON.parse(localStorage.getItem("cityList")) || [];

console.log("index.js connected!");


// Function and Event Listener to store the new city searched
var saveCity = function(event){
    
    cityList = JSON.parse(localStorage.getItem("cityList")) || [];

    event.preventDefault();
    
    if($("#searched_city").val() === "") {
        console.log("Empty Search!");
        return;
    }

    console.log($("#searched_city").val());

    var newCity = $("#searched_city").val();

    searchWeatherData(newCity);

};

$("form").on("submit", saveCity);


var searchWeatherData = function(cityName) {
    console.log(cityName + " weather data has been searched.");
};



// BONUS: Create a clear button to clear out the searched cities and reloads
// If there are no no current search results, hide the forecast and clear button