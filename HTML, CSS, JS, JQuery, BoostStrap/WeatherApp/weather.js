const apiKey = "f413a804591d4ca28ef111654242806"; //key for weather api
const comboBox = document.querySelector('#cities'); //call city combox obj

const cities = ["Bangkok", "Yangon", "Mandalay", "Magway", "Chiang Mai"]; //allow five cities

//appears as soon as loaded
function welcomePage() {

    //add cities in combo box
    cities.map(city => {
        const cityName = city;
        const option = document.createElement('option');
        option.value = cityName;
        option.textContent = cityName;
        comboBox.appendChild(option);
    })

    showCurrentCityWeather(); //call function to show current city if available and Paris if not
}
welcomePage();

//function to get current city and show its weather condition
function showCurrentCityWeather() {
    const status = document.querySelector("#status"); //call location status element

    //use geolocation of html to get longitude and latitude
    if (!navigator.geolocation) { //if not supported, compose error message and display Paris as default
        status.textContent = 'Geolocation is not supported by your browser.\nTherefore, default city is displayed here instead of current location.';
        showWeather("Paris");
    } else { //if supported, do this
        navigator.geolocation.getCurrentPosition(success, error); //run success for success and run error for failure
    }

    //do this if above function succeed
    async function success(position) {
        //fetch latitude and longitude from position, prepare url with them
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

        //fetch city data
        try {
            const response = await fetch(url);
            const data = await response.json();
            const city = data.address.city;
            showWeather(city); //display current city since available
        } catch (error) { //compose error message and display Paris as default to catch
            status.textContent = 'Unable to retrieve your city.\nTherefore, default city is displayed here instead of current location.';
            showWeather("Paris");
        }
    }

    //do this if above function fails
    function error() { //for failure, compose error message and display Paris as default
        status.textContent = 'Unable to retrieve your location.\nTherefore, default city is displayed here instead of current location.';
        showWeather("Paris");
    }

}

//function to display weather of specific city when city is selected
async function specificLocation() {
    const status = document.querySelector("#status"); //call location status element
    status.textContent = ""; //remove location status if there is since it is an error message for unavailability of current city

    const selected_city = comboBox.value; //get selected city from combo box
    showWeather(selected_city); //call function with selected city
}

//common function to show weather conditions
async function showWeather(selected_city) {

    //fetch forecast data with api
    const type = "forecast.json";
    const city = selected_city;
    const url = `http://api.weatherapi.com/v1/${type}?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();

    //1. city name
    const location = document.createElement('p');
    location.textContent = city;

    //2. temperature
    const temperature = document.createElement('h1');
    temperature.classList.add("display-1", "text-center");
    temperature.innerHTML = data.current.temp_f + "<sup>°</sup>";

    //3. weather condition
    const condition = document.createElement('p');
    condition.classList.add("display-6");
    condition.textContent = data.current.condition.text;

    //4. hour forecast section
    const hours = data.forecast.forecastday[0].hour; //fetch all hours of the day
    const current_hour = new Date().toTimeString().split(":")[0]; //fetch hour part of the current hour
    const hour_section = document.createElement('div'); //container for all hourly forecasts
    hour_section.classList.add("d-flex", "flex-row", "hour-forecast-css", "p-0", "m-2");

    //add all hourly forecasts in the section
    hours.map(hour => {

        //continer that has time and icon in it
        const container = document.createElement('div');
        container.classList.add("col-3", "d-flex", "flex-column", "align-items-center");

        //icon
        const forecast = document.createElement('img');
        forecast.src = "https:" + data.current.condition.icon;
        forecast.classList.add("p-0", "m-0", "col-9", "al");

        //time
        const time = document.createElement('p');
        time.classList.add("m-0");

        //to replace current hour with "Now"
        const displayed_hour = hour.time.split(" ")[1]; //fetch time from the hour array to match with current hour
        if (current_hour == displayed_hour.split(":")[0]) { //only fetch hour parts to compare without minutes and seconds
            time.innerHTML = "<b>Now</b>";
        }
        else {
            time.textContent = displayed_hour;
        }

        //add time and icon in container
        container.appendChild(time);
        container.appendChild(forecast);

        //add the container to the whole hour forecast section
        hour_section.appendChild(container);
    })

    const section = document.querySelector('#weather-section'); //call weather scetion obj
    //remove previous inserted before inserting another
    while (section.firstChild) { //till there is a child
        section.removeChild(section.firstChild); //remove that child
    }

    //adding all to the parent container
    section.appendChild(location); //1
    section.appendChild(temperature); //2
    section.appendChild(condition); //3
    section.appendChild(hour_section); //4
}

