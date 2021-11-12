
var cityEl = document.querySelector("#city-input");
var searchButtonEl = document.querySelector("#cityform");
var boardEl = document.querySelector("#weather-board");
var nextDaysEl = document.querySelector("#days-forecast");
var listEl = document.querySelector("#list");
//get the current day and its format
var newDay = moment().format("M/D/YYYY");
console.log(newDay);
var cityName = [];

// function to search for the weather based on the input value
var formCity = function(event) {
    event.preventDefault();

    var cityName = cityEl.value.trim();

    if (cityName) {
        searchCity(cityName);
        searchNextDays(cityName);
        cityEl.value = "";
        
    }
    else {
        alert("Please type the name of the city!");
    }
}
// API URL to get the weather
var searchCity = function(city) {
    var upiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=7dd88f32a109d912270a061c88f5e76e&units=imperial"

    fetch(upiUrl).then(function(response){
     if (response.ok) {
         response.json().then(function(data){
             console.log(data);
             displayWeather(data);

             cityName.push(data.name);
         localStorage.setItem("city", JSON.stringify(cityName));

         makeList(data.name);
         })
     }
    })
}

//function to display the current day's weather
var displayWeather = function(forecast) {
    //clear old content
    boardEl.innerHTML = "";
  
        
for (var i = 0; i < forecast.lenght; i++);
   
   var icon = document.createElement("img");
   icon.setAttribute("src", "https://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png" )
   var titleWeather = document.createElement("h4");
   titleWeather.textContent = forecast.name + " (" + newDay +")";
   boardEl.appendChild(titleWeather);
   titleWeather.appendChild(icon);
   boardEl.classList.add("border", "border-2", "p-1");

   var temp = document.createElement("p");
   temp.textContent = "Temp: " + Math.floor(forecast.main.temp) + "°F";
   boardEl.appendChild(temp);

   var wind = document.createElement("p");
   wind.textContent = "Wind: " + Math.floor(forecast.wind.speed) + " MPH";
   boardEl.appendChild(wind);

   var humidity = document.createElement("p");
   humidity.textContent = "Humidity: " + (forecast.main.humidity) + " %";
   boardEl.appendChild(humidity);

   var lat = forecast.coord.lat;
   var lon = forecast.coord.lon;
   
   searchUvi(lat,lon);
} 
// API URL to find the UVI
var searchUvi = function(lat, lon) {
    var uviUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=daily&appid=7dd88f32a109d912270a061c88f5e76e&units=imperial";
   fetch(uviUrl).then(function(response){
     if(response.ok) {
         response.json().then(function(data){
             displayUvi(data);

         })
     }
        
          
   })
}
//function to display the UVI
var displayUvi = function(forecast){
   
    var uviSpan = document.createElement("span");
    uviSpan.textContent = forecast.current.uvi;

    // condition to define the color of the uvi number
    if(uviSpan.textContent <= 4) {
      uviSpan.classList.add("bg-success", "text-light");
    }
    else if (4 < uviSpan.textContent <= 8) {
        uviSpan.classList.add("bg-warning", "text-dark"); 
    }
    else if (uviSpan.textContent > 8) {
        uviSpan.classList.add("bg-danger", "text-light");
    }

    var uvi = document.createElement("p");
    uvi.textContent = "UV Index: ";

    boardEl.appendChild(uvi);
    uvi.appendChild(uviSpan);

    
}

function searchNextDays(city) {
    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=7dd88f32a109d912270a061c88f5e76e&units=imperial",
        dataType: "json",
        success: function (data) {
            // overwrite any existing content with title and empty row
            $("#days-forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

            // loop over all forecasts (by 3-hour increments)
            for (var i = 0; i < data.list.length; i++) {
                // only look at forecasts around 3:00pm
                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    // create html elements for a bootstrap card
                    var col = $("<div>").addClass("col-lg-2 m-1");
                    var card = $("<div>").addClass("card bg-secondary text-white");
                    var body = $("<div>").addClass("card-body p-2");

                    var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());

                    var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

                    var temp = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp + " °F");
                    var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");

                    // merge together and put on page
                    col.append(card.append(body.append(title, img, temp, humidity)));
                    $("#days-forecast .row").append(col);
                }
            }
        }
    });
}

var makeList = function(city) {

    if (cityName !== null) {
   
        for(var i = 0; i < cityName.lenght; i++);
        var listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "bg-light", "text-dark", "my-2");
    listEl.appendChild(listItem);
    listItem.textContent = city;
    console.log(cityName);
        
        }
}
   
searchButtonEl.addEventListener("submit", formCity);
