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
let today = moment().format('ddd MMM Do');
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
//for storing multiple objects of city
let cities = [];
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
 * From stackoverflow.com capitalize in general for english
 * @param {*} string 
 * @returns 
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
/**
 * 
 * @param {*} returnedObject - JSON returned from API of open weather
 *  .temp
 *  humidity
 *  wind_speed
 */
function currentDayResult(cityName, returnedObject){
    document.querySelector('#currentDayHeader').textContent = cityName+" on this "+today;
    document.querySelector('#currentDayIcon').setAttribute("src", weatherIconURL+returnedObject.weather[0].icon+weatherIconClose);
    document.querySelector('#tempCurrentDay').textContent = returnedObject.temp+"°F";
    document.querySelector('#windCurrentDay').textContent = returnedObject.wind_speed+" MPH";
    document.querySelector('#humidityCurrentDay').textContent = returnedObject.humidity+" %";
    document.querySelector('#uvIndex').textContent = returnedObject.uvi;
}

function fiveDayResult(dailyObject){
    for(var i = 1; i < 6 ; i++){
        document.querySelector('#forecastDate'+i).textContent = moment().add(i, 'd').format("ddd Do");
        document.querySelector('#forceastIcon'+i).setAttribute("src", weatherIconURL+dailyObject[i].weather[0].icon+weatherIconClose);
        document.querySelector('#tempForcastDay'+i).textContent = dailyObject[i].temp.max+"°F";
        document.querySelector('#windForcastDay'+i).textContent = dailyObject[i].wind_speed+"MPH";
        document.querySelector('#humidityForcastDay'+i).textContent = dailyObject[i].humidity+"%";
    }
}

/**
 * expecting city style object. this object is based on the JSON Openweathermap.org returns
 */
function storeLatAndLonResult(foundCity){
    if(typeof foundCity !== 'undefined'){
        //clear out previous cities
            city = {}
        city.name = capitalizeFirstLetter(foundCity.name);
        city.lat = foundCity.lat;
        city.lon = foundCity.lon;
        city.state = foundCity.state;
        city.country = foundCity.country;
        var passingURL = weatherURLQuery+city.lat+weaterhLonQuery+city.lon+weatherUnitsQuery[0]+weatherExclusionQuery[0]+weatherExclusionQuery[1]+","+weatherExclusionQuery[2]+","+weatherExclusionQuery[3]+weatherAPIKeyQuery+weatherAPIKey;
        saveLocal();
        listCity(city);
        getWeather(city.name, passingURL);
    } else{
        document.location.replace(redirectUrl);
        document.querySelector('#cityNameError').textContent = cityInputEl.value
    }

}

function getWeather(currentCity, weatherSearchURL){
    fetch(weatherSearchURL)
    .then(function(response){
        if (response.status !== 200) {
            // redirect to 404 page if weather doesn't return
            document.location.replace(redirectUrl);
        } else {
            return response.json();
        }
    }).then(function (data){
         currentDayResult(currentCity, data.current);
         fiveDayResult(data.daily);
         showtime();
    })
}

searchBtn.addEventListener("click", function(){
    if(cityInputEl.value !== null){
        var urlToFetch = "";
        var checkName = cityInputEl.value;  
        var cityState = checkName.split(",")
        if(cityState.length > 1){
            urlToFetch = latLonCoordinates+cityState[0].trim()+","+cityState[1].trim()+",US&limit=1"+weatherAPIKeyQuery+weatherAPIKey;
        } else{
            urlToFetch = latLonCoordinates+checkName.trim()+"&limit=1"+weatherAPIKeyQuery+weatherAPIKey;
        }
            getLocation(urlToFetch);
        }
    }
);

function showtime(){
    document.querySelector("#weatherOutput").removeAttribute("hidden");
}

function listCity(incomingObject){
 //   var count = citySearchedListEl.childElementCount;
    var citySearchedButtonEl = document.createElement('li');
    citySearchedButtonEl.classList = "city";
    citySearchedButtonEl.textContent = incomingObject.name;
   // citySearchedButtonEl.setAttribute("id", "city"+count);
    citySearchedListEl.appendChild(citySearchedButtonEl);
    
}


function saveLocal(){
    cityInputEl.value = "";
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
}

citySearchedListEl.addEventListener("click", function(event){
    event.preventDefault();
    var element = event.target;
    if(element.matches("li")===true){
        var requestedCity = element.innerText;
        loadPreviousCity(requestedCity);
    }
})

function getLocation(passedURL){
    fetch(passedURL)
        .then(function(response){
            console.log(response);
            if (response.status !== 200) {
                // If the page is not on the 404 page, redirect to it.
                debugger
                document.location.replace(redirectUrl);
            } else {
                return response.json();
            }
        }).then(function (data){
            storeLatAndLonResult(data[0]);
        });
}

function reloadCities(){
    var storedCities = JSON.parse(localStorage.getItem('cities'));
    if(storedCities !== null){
        cities = storedCities;
    }
    if(cities.length>0){
        for(var i = 0; i < cities.length; i++){
            listCity(cities[i]);
        }
    }
}

function loadPreviousCity(requestedCity){
    debugger
    var index = cities.findIndex(x => x.name == requestedCity);
    //step through procedure again
    if(index > -1){
        var passingURL = weatherURLQuery+cities[index].lat+weaterhLonQuery+cities[index].lon+weatherUnitsQuery[0]+weatherExclusionQuery[0]+weatherExclusionQuery[1]+","+weatherExclusionQuery[2]+","+weatherExclusionQuery[3]+weatherAPIKeyQuery+weatherAPIKey;
        getWeather(cities[index].name, passingURL);
    }
}


//On page load retrieve any cities stored in local storage
reloadCities();