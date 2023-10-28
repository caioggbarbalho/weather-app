// coordenadas itu -23.2851783 -47.3170162
const apiKey= '7639430231d83677925be9230ddae731';
const apiUrl= 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
const apiGeo = 'http://api.openweathermap.org/geo/1.0/reverse?'

const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');

if ("geolocation" in navigator) {
  // Do something with coordinates returned
  function processCoords(position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      console.log(latitude, longitude);

      async function coordToCity() {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${apiKey}`
        )

        if(response.status == 404 || response.status == 400){
          document.querySelector('.error').style.display = 'block';
          document.querySelector('.weather').style.display = 'none';
        } else { 
        
            let geoData = await response.json();
            let city = geoData[0].name;

            checkWeather(city);

      }}

      coordToCity();

        
      
  }

  // Fetch Coordinates
  navigator.geolocation.getCurrentPosition(processCoords);

  
}

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if(response.status == 404 || response.status == 400){
    document.querySelector('.error').style.display = 'block';
    document.querySelector('.weather').style.display = 'none';
  } else { 
    
    let data = await response.json();

    console.log(data);

    document.querySelector('.city').innerHTML = data.name;
    document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '°C';
    document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
    document.querySelector('.wind').innerHTML = data.wind.speed + ' m/s';

    if (data.weather[0].main == 'Clouds'){
      weatherIcon.src = 'images/clouds.png';
    } 
    else if (data.weather[0].main == 'Clear'){
      weatherIcon.src = 'images/clear.png';
    } 
    else if (data.weather[0].main == 'Rain'){
      weatherIcon.src = 'images/rain.png';
    } 
    else if (data.weather[0].main == 'Drizzle'){
      weatherIcon.src = 'images/drizzle.png';
    } 
    else if (data.weather[0].main == 'Mist'){
      weatherIcon.src = 'images/mist.png';
    } 
    else if (data.weather[0].main == 'Snow'){
      weatherIcon.src = 'images/snow.png';
    }

    document.querySelector('.weather').style.display = 'block';
    document.querySelector('.error').style.display = 'none';

    //Adding time-variant style
    //Pulling sunset and timezone data from api
    const sunsetTime = data.sys.sunset; //convert to miliseconds
    const timezoneOffset = data.timezone;

    //Calculating current time at location
    const currentTime = new Date();
    const localTime = new Date(currentTime.getTime() + timezoneOffset);

    //console.logging values
    console.log('Sunset Time:', sunsetTime)
    console.log('Timezone offset:', timezoneOffset)
    console.log('Current Time:', currentTime)
    console.log('Local Time:', localTime)
    

    //Comparing current time with sunset time
    const isDayTime = currentTime < new Date(sunsetTime);

    //Checking if isDayTine is true to apply style to background
    if (isDayTime) {
      document.body.style.backgroundColor = 'lightblue';
    } else {
      document.body.style.backgroundColor = 'midnightblue';
    }
  }
}

searchBtn.addEventListener('click', () => {
  checkWeather(searchBox.value);

});

searchBox.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    checkWeather(searchBox.value);
  }
});

