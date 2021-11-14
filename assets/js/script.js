
var cityEl = document.querySelector("#city-input");
var searchButtonEl = document.querySelector("#cityform");
var boardEl = document.querySelector("#weather-board");
var nextDaysEl = document.querySelector("#days-forecast");
var listEl = document.querySelector("#list");
//get the current day and its format
var newDay = moment().format("M/D/YYYY");

//array for the searched citites
cityNameArr= JSON.parse(localStorage.getItem("city")) || [];
console.log(cityNameArr);

// function to search for the weather based on the input value
var formCity = function(event) {
event.preventDefault();
//value pro input to be used for the functions
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
//when the <li> is clicked, the functions will be activated to display the current wheater and the next 5 days forecast by using the targeted <li>' value
$("#list").on("click", "li", function() {
    searchCity($(this).text());
    searchNextDays($(this).text());
})
//function to create the list with previous searched cities
var makeList = function(text) {

    var listItem = document.createElement("li");
listItem.classList.add("list-group-item", "bg-light", "text-dark", "my-2");
listEl.appendChild(listItem);
listItem.textContent = text;
    
    }
// API URL to get the weather
var searchCity = function(city) {
    var upiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=7dd88f32a109d912270a061c88f5e76e&units=imperial"

    //if the response is okay, the data will be used to run the function to display the current weather
    fetch(upiUrl).then(function(response){
     if (response.ok) {
         response.json().then(function(data){
             displayWeather(data);
    //if the city is being searched for the fist time, it will be saved to cityNameArr array and the local storage.
             if (!cityNameArr.includes(data.name)){
                cityNameArr.push(data.name);
                localStorage.setItem("city", JSON.stringify(cityNameArr));
             }
             

         })
     }
    })
}

//function to display the current day's weather
var displayWeather = function(forecast) {
    //clear old content
    boardEl.innerHTML = "";
  
   // icon describing the current weather
   var icon = document.createElement("img");
   icon.setAttribute("src", "https://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png" )
   // title composed by city's name and the date
   var titleWeather = document.createElement("h4");
   titleWeather.textContent = forecast.name + " (" + newDay +")";
   // append the title to its <div>
   boardEl.appendChild(titleWeather);
   // append the icon to the title to make it part of the title
   titleWeather.appendChild(icon);
   boardEl.classList.add("border", "border-2", "p-1");
   //temperature description: 
   var temp = document.createElement("p");
   temp.textContent = "Temp: " + Math.floor(forecast.main.temp) + "°F";
   boardEl.appendChild(temp);
   // wind description:
   var wind = document.createElement("p");
   wind.textContent = "Wind: " + Math.floor(forecast.wind.speed) + " MPH";
   boardEl.appendChild(wind);
   //humidity description:
   var humidity = document.createElement("p");
   humidity.textContent = "Humidity: " + (forecast.main.humidity) + " %";
   boardEl.appendChild(humidity);
   //latitude and longitude items to be used as parameters on the function to find UVI 
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
    //span created to be used apart for the number so it can be edited
    var uviSpan = document.createElement("span");
    uviSpan.textContent = forecast.current.uvi;
    uviSpan.classList.add("p-1");

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
    // the introduction to describe the UVI 
    var uvi = document.createElement("p");
    uvi.textContent = "UV Index: ";
    // append the <span> to the <p> so the number will be shown next to its introduction
    boardEl.appendChild(uvi);
    uvi.appendChild(uviSpan);

    
}
//next 5 days forecast function
function searchNextDays(city) {
    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=7dd88f32a109d912270a061c88f5e76e&units=imperial",
        dataType: "json",
        success: function (data) {
            // overwrite any existing content with title and empty row
            $("#days-forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
             console.log(data);
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

                    var temp = $("<p>").addClass("card-text").text("Temp: " + Math.floor(data.list[i].main.temp) + " °F");
                    var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");

                    // merge together and put on page
                    col.append(card.append(body.append(title, img, temp, humidity)));
                    $("#days-forecast .row").append(col);
                }
            }
        }
    });
}


    // if statement to ensure that, if the user has searched for a city previously, the last one will pop up when the page is refreshed
    if (cityNameArr.length > 0) {
        searchCity(cityNameArr[cityNameArr.length - 1]);
        searchNextDays(cityNameArr[cityNameArr.length - 1]);
        

    }
    // for loop to list all the previous searched cities
    for (var i = 0; i < cityNameArr.length; i++) {
        makeList(cityNameArr[i]);
    }
    

       //when the input is filled and the user either ckick the search button or press enter.
searchButtonEl.addEventListener("submit", formCity);
