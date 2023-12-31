// coordenadas itu -23.2851783 -47.3170162
const apiKey= '7639430231d83677925be9230ddae731';
const apiUrl= 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
const apiGeo = 'http://api.openweathermap.org/geo/1.0/reverse?'

const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');


//Load System informations at start
if ("geolocation" in navigator) {
  //Do something with coordinates returned
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

  //Fetch Coordinates
  navigator.geolocation.getCurrentPosition(processCoords);
}

//Function for checking weather
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
    //Pulling sunset and current time from api
    const sunsetTime = data.sys.sunset; // UNIX timestamp
    const currentTime = data.dt;
    const offset = data.timezone; // Timezone offset in seconds

    console.log('Sunset Time: ' + sunsetTime);
    console.log('Current Time: ' + currentTime);
    console.log('Offset: ' + offset);

    // Use the offset to calculate the target time
    const targetTime = new Date((currentTime + offset) * 1000); // Convert Unix timestamp to milliseconds

    // Format the target time according to the offset
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedTargetTime = formatter.format(targetTime);

    console.log('Formatted Target Time: ' + formattedTargetTime);

    //change .time html to equal time on location
    document.querySelector('.time').innerHTML = formattedTargetTime;


    const isDayTime = currentTime < sunsetTime;

    //Checking if isDayTime is true to apply style to background
    let card = document.querySelector('.card');

    if (!isDayTime) {
      document.body.style.backgroundColor = 'rgb(60, 60, 60)';
      card.classList.add('card-night')
    } else {
      document.body.style.backgroundColor = 'rgb(200, 248, 255)';
      card.classList.remove('card-night')
    }
  }
}

//Event Listeners to search when click or keydown
searchBtn.addEventListener('click', () => {
  checkWeather(searchBox.value);

});

searchBox.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    checkWeather(searchBox.value);
  }
});

