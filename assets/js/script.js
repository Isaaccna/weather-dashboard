var cityEl = document.querySelector("#city-input");
var searchButtonEl = document.querySelector("#cityform");
var boardEl = document.querySelector("#weather-board");
var nextDaysEl = document.querySelector("#days-forecast");
var newDay = moment().format("M/D/YYYY");
console.log(newDay);

var formCity = function(event) {
    event.preventDefault();

    var cityName = cityEl.value.trim();

    if (cityName) {
        searchCity(cityName);
        cityEl.value = "";
        
    }
    else {
        alert("Please type the name of the city!");
    }
}

var searchCity = function(city) {
    var upiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=7dd88f32a109d912270a061c88f5e76e&units=imperial"

    fetch(upiUrl).then(function(response){
     if (response.ok) {
         response.json().then(function(data){
             console.log(data);
             displayWeather(data);

       
         })
     }
    })
}


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
   boardEl.classList.add("border", "border-2");

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

var displayUvi = function(forecast){
   
    var uviSpan = document.createElement("span");
    uviSpan.textContent = forecast.current.uvi;

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

   
searchButtonEl.addEventListener("submit", formCity);
