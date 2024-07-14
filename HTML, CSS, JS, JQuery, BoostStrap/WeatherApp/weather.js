const apiKey = "f413a804591d4ca28ef111654242806";
const comboBox = document.querySelector('#cities');

const cities = ["Bangkok", "Yangon", "Mandalay", "Magway", "Chiang Mai"];

async function welcomePage() {
    cities.map(city => {
        const cityName = city;
        const option = document.createElement('option');
        option.value = cityName;
        option.textContent = cityName;
        comboBox.appendChild(option);
    })
    const data = await fetchData("Bangkok", "forecast.json");
    const location = document.createElement('p');
    location.textContent = "Bangkok";

    const temperature = document.createElement('h1');
    temperature.classList.add("display-1", "text-center");
    temperature.innerHTML = data.current.temp_f + "<sup>°</sup>";

    const condition = document.createElement('p');
    condition.classList.add("display-6");
    condition.textContent = data.current.condition.text;

    const hours = data.forecast.forecastday[0].hour;
    const current_hour = new Date().toTimeString().split(":")[0];
    const hour_section = document.createElement('div');
    hour_section.classList.add("d-flex", "flex-row", "hour-forecast-css", "bg-transparent", "p-0", "m-2");
    hours.map(hour => {
        const container = document.createElement('div');
        container.classList.add("col-3", "d-flex", "flex-column", "align-items-center");
        const forecast = document.createElement('img');
        forecast.src = "https:" + data.current.condition.icon;
        forecast.classList.add("p-0", "m-0", "col-9", "al");
        const time = document.createElement('p');
        time.classList.add("m-0");

        const displayed_hour = hour.time.split(" ")[1];
        if (current_hour == displayed_hour.split(":")[0]) {
            time.innerHTML = "<b>Now</b>";
        }
        else {
            time.textContent = displayed_hour;
        }
        container.appendChild(time);
        container.appendChild(forecast);
        hour_section.appendChild(container);
    })

    const displayed_date = data.forecast.forecastday[0].date;
    const date = document.createElement('h3');
    date.textContent = displayed_date;

    const section = document.querySelector('#weather-section');
    section.appendChild(location);
    section.appendChild(temperature);
    section.appendChild(condition);
    section.appendChild(hour_section);
    section.appendChild(date);

    const date_picker = document.querySelector("#datepicker");
    date_picker.classList.remove("d-none");
}
welcomePage();

function showDate(){
    const date_picker = document.querySelector("#datepicker");
    console.log(date_picker.value);
}

async function showData() {
    const selected_city = comboBox.value;
    const data = await fetchData(selected_city, "forecast.json");
    console.log(data);


    // Access the `hour` array
    const hours = data.forecast.forecastday[0].hour;
    const currentTime = '2024-07-12 20:00';
    const currentWeather = hours.find(hour => hour.time === currentTime);

    const condition = document.createElement('h3');
    condition.classList.add("condition-css");
    condition.classList.add("display-5");
    condition.textContent = currentWeather.condition.text;
    const section = document.querySelector('#weather-section');
    const hour_section = document.createElement('div');
    hour_section.classList.add("d-flex");

    //pagination
    const pagination = document.createElement('ul');
    pagination.classList.add("pagination");


    //remove previous image inserted in the modal before inserting another
    while (section.firstChild) { //till there is a child
        section.removeChild(section.firstChild); //remove that child
    }

    hours.map(hour => {
        const btn = document.createElement('button');
        btn.classList.add("btn", "btn-warning");
        btn.textContent = hour.time.split(" ")[1];
        hour_section.appendChild(btn);
    })
    section.appendChild(hour_section);
    section.appendChild(condition);
}

async function fetchData(selected_city, weather_type) {
    const type = weather_type;
    const city = selected_city;
    const url = `http://api.weatherapi.com/v1/${type}?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

function showPage(pageNo) {
    const header = document.createElement('h1');
    header.textContent = pageNo;
    const section = document.querySelector("#weather-section");
    section.appendChild(header);
}
