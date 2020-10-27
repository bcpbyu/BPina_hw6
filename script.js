// Global variables
var rnWeather = $("#rnWeather");
var cities = [0];
var savedCities = [];
var lat;
var lon;
var city;

// API variables
var rnURL = "https://api.openweathermap.org/data/2.5/weather?";
var daysURL = "https://api.openweathermap.org/data/2.5/onecall?";
var uvURL = "http://api.openweathermap.org/data/2.5/uvi?";
var APIKey = "18409c975f3793d3225bf3a92db4ca88";

// Call load function
load();

// Event listener for search button
$("#search").on("click", function () {
    rnWeather.empty();
    city = $("#cityInput").val().trim();
    $("#cityInput").val("");
    weatherRn();
    cityList();
    console.log(cities);
});

// Event listener for city buttons
$(document).on("click", "#cityButton", function(){
    city = $(this).attr("data-city");
    rnWeather.empty();
    for (var i = 1; i < 6; i++){
        $("#day"+i).empty();
    }
    weatherRn();
});

// Event listener for clear button
$("#clear").on("click", function(){
    localStorage.removeItem("cities");
    location.reload();
});

// Function to search and display the city's forecast
function weatherRn() {
    var query1URL = rnURL + "q=" + city + "&appid=" + APIKey;
    $.ajax({
        url: query1URL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        $("<h3>").text(response.name).appendTo(rnWeather);
        $("<p>").text("Temperature: " + ((response.main.temp - 273.15) * 1.8 + 32).toFixed(1) + " °F").appendTo(rnWeather);
        $("<p>").text("Humidity: " + response.main.humidity + "%").appendTo(rnWeather);
        $("<p>").text("Wind Speed " + response.wind.speed + " MPH").appendTo(rnWeather);
        lat = response.coord.lat;
        lon = response.coord.lon;
        console.log(lat);
        console.log(lon);
        var query3URL = daysURL + "lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
        $.ajax({
            url: query3URL,
            method: "GET"
        }).then(function(response) {
            console.log(response);

            var uv = $("<p>").text("UV Index: ").appendTo(rnWeather);
            var uvin = $("<span>").text(response.daily[0].uvi).addClass("border rounded p-1").appendTo(uv);
            if (response.daily[0].uvi < 3) {
                uvin.css("background-color","#54ff82");
            }
            else if (response.daily[0].uvi > 3 && response.daily[0].uvi < 7) {
                uvin.css("background-color", "#fff954");
            }
            else {
                uvin.css("background-color", "#ff5454");
            }

            for (var i = 1; i < 6; i++) {
                $("#day" + i).empty();
                var d1 = new Date(response.daily[i].dt * 1000);
                $("<h5>").text(d1.getMonth()+1 + "/" + d1.getDate() + "/" + d1.getFullYear()).appendTo("#day" + i);
                var icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png").appendTo("#day" + i);
                icon.css("height","50px");
                $("<p>").text("Temp: " + ((response.daily[i].temp.day-273.15)*1.8+32).toFixed(1) + " °F").appendTo("#day" + i);
                $("<p>").text("Humidity: " + response.daily[i].humidity + "%").appendTo("#day" + i);
            }
        });
    });
}

// Function to create the list of past searched cities
function cityList () {
    var cityAdd = $("<li>").text(city).attr("data-city",city);
    cityAdd.attr("id", "cityButton");
    cities.push(cities.length);
    cityAdd.appendTo("#cityList");
    cityAdd.addClass("py-2 border");
    savedCities.push(city);
    console.log(savedCities);
    localStorage.setItem("cities",JSON.stringify(savedCities));
    console.log("saved: " + JSON.parse(localStorage.getItem("cities")));
}

// Function to create list of past searched saved cities
function load() {
    var localCities = JSON.parse(localStorage.getItem("cities"));
    if (localCities != null){
        savedCities = localCities;
    }
    for (var i = 0; i < savedCities.length; i++){
    var cityAdd = $("<li>").text(savedCities[i]).attr("data-city",savedCities[i]);
    cityAdd.attr("id", "cityButton");
    cities.push(cities.length);
    cityAdd.appendTo("#cityList");
    cityAdd.addClass("py-2 border");
    }
    city = savedCities[savedCities.length - 1];
    weatherRn();
}

