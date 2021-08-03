let cityInputEl = document.querySelector('#cityToSearch');
let searchBtn = document.querySelector("#citySearchBtn");
let citySearchedListEl = document.querySelector("#searchedCityList");
let redirectUrl = './404.html';
/**
 * Onc Call - get current, 7 day, UV with single call
 * https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
 * {lat} and {lon} required
 * OPTIONAL - excdlude {part} must be comma deliminated - current,minutely,hourly,daily,alerts
 * OPTIONAL - units {part} - default will be snadard if not applied -standard, metric and imperial
 * current weather request
 * https://api.openweathermap.org/data/2.5/weather?q=
 */
let weatherURLQuery = "https://api.openweathermap.org/data/2.5/onecall?lat=";
let weaterhLonQuery = "&lon=";
let weatherAPIKeyQuery = "&appid=";
let weatherUnitsQuery = ["&units=imperial", "&units=metric"];
let weatherExclusionQuery = ["&exclude=", "hourly","minutely","alerts"]
/**
 *  To obtain JSON back with latitude and longitude coordinates, enables One Call API from Openweather
 *  {city name},
 * {state code},
 * {country code}
 *  &limit={limit}
 */
let latLonCoordinates = "http://api.openweathermap.org/geo/1.0/direct?q="
/**
 * This must be appended to the end of all queries to Openweathermap.org
 * &appid={API key}
 */
let weatherAPIKey = "f03ee938eeff29bc82f25e6ffcc8969d";
let weatherIconURL = "http://openweathermap.org/img/wn/";
let weatherIconClose = "@2x.png";
let today = moment().format('MMM Do');
/**
 * 
 */
let city = [
    {
        name: "",
        lat: "",
        lon: "",
        state: "",
        country: "",
        zipCode: ""
    }
];

// let storedCityWeather = [
//     {
//         city: [],
//         day: "",
//         value: "",
//         humidity:"",
//         temp:"",
//         wind_speed:""
//     }
// ]
/**
 * 
 * @param {*} returnedObject 
 *  .temp
 *  humidity
 *  wind_speed
 */
function currentDayResult(returnedObject){
   

    document.querySelector('#currentDayHeader').textContent = city.name.toLocaleUpperCase()+" on this "+today;
    document.querySelector('#currentDayIcon').setAttribute("src", weatherIconURL+returnedObject.weather[0].icon+weatherIconClose);
    document.querySelector('#tempCurrentDay').textContent = returnedObject.temp+"°F";
    document.querySelector('#windCurrentDay').textContent = returnedObject.wind_speed+" MPH";
    document.querySelector('#humidityCurrentDay').textContent = returnedObject.humidity+" %";
    document.querySelector('#uvIndex').textContent = returnedObject.uvi;

}

function fiveDayResult(dailyObject){
    for(var i = 1; i < 6 ; i++){
        document.querySelector('#forecastDate'+i).textContent = moment().add(i, 'd').format("dd Do");
        document.querySelector('#forceastIcon'+i).setAttribute("src", weatherIconURL+dailyObject[i].weather[0].icon+weatherIconClose);
        document.querySelector('#tempForcastDay'+i).textContent = dailyObject[i].temp.max+"°F";
        document.querySelector('#windForcastDay'+i).textContent = dailyObject[i].wind_speed+"MPH";
        document.querySelector('#humidityForcastDay'+i).textContent = dailyObject[i].humidity+"%";
    }
}

/**
 * 
 */
function getLatAndLonResult(foundCity){
    city.lat = foundCity.lat;
    city.lon = foundCity.lon;
    city.state = foundCity.state;
    city.country = foundCity.country;

    fetch(weatherURLQuery+city.lat+weaterhLonQuery+city.lon+weatherUnitsQuery[0]+weatherExclusionQuery[0]+weatherExclusionQuery[1]+","+weatherExclusionQuery[2]+","+weatherExclusionQuery[3]+weatherAPIKeyQuery+weatherAPIKey)
        .then(function(response){
            console.log(response);
            if (response.status !== 200) {
                // If the page is not on the 404 page, redirect to it.
                document.location.replace(redirectUrl);
            } else {
                return response.json();
            }
        }).then(function (data){
            console.log(data);
             currentDayResult(data.current);
             fiveDayResult(data.daily);
             showtime();
             listCity();
        })

}

searchBtn.addEventListener("click", function(){
    
    if(cityInputEl.value !== null){
  
        var urlToFetch = "";
        var checkName = cityInputEl.value;  
        var cityState = checkName.split(",")
        if(cityState.length > 1){
            city.name = cityState[0].trim();
            city.state = cityState[1].trim();
            urlToFetch = latLonCoordinates+city.name+","+city.state+",US&limit=1"+weatherAPIKeyQuery+weatherAPIKey;
        } else{
            city.name = checkName.trim();
            urlToFetch = latLonCoordinates+city.name+"&limit=1"+weatherAPIKeyQuery+weatherAPIKey;
        }
        console.log(urlToFetch);
        fetch(urlToFetch)
            .then(function(response){
                console.log(response);
                if (response.status !== 200) {
                    // If the page is not on the 404 page, redirect to it.
                    document.location.replace(redirectUrl);
                } else {
                    return response.json();
                }
            }).then(function (data){
                console.log(data);
                getLatAndLonResult(data[0]);
            });
        }
    }
);

function showtime(){
    document.querySelector("#weatherOutput").removeAttribute("hidden");
}

function listCity(){
 //   var count = citySearchedListEl.childElementCount;
    var citySearchedButtonEl = document.createElement('li');
    citySearchedButtonEl.classList = "city";
    citySearchedButtonEl.textContent = city.name;
   // citySearchedButtonEl.setAttribute("id", "city"+count);
    citySearchedListEl.appendChild(citySearchedButtonEl);
    saveLocal();
}


function saveLocal(){
    return;//TODO
}

citySearchedListEl.addEventListener("click", function(event){
    event.preventDefault();

    var element = event.target;
    debugger
    if(element.matches("li")===true){
        var requestedCity = element.innerText();
        loadPreviousCity(requestedCity);
    }

})

function loadPreviousCity(){
    return;//TODO
}