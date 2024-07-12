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
    temperature.textContent = data.current.temp_f;

    const condition = document.createElement('p');
    condition.textContent = data.current.condition.text;

    const hours = data.forecast.forecastday[0].hour;
    const hourBtns = document.createElement('div');
    hourBtns.classList.add("d-flex", "flex-row", "hour-forecast-css", "bg-success");
    hours.map(hour => {
        const container = document.createElement('div');
        container.classList.add("w-25");
        const forecast = hour.condition.text;
        const time = document.createElement('p');
        time.textContent = hour.time.split(" ")[1] + "\n" + forecast;
        container.appendChild(time);
        hourBtns.appendChild(container);
    })

    const section = document.querySelector('#weather-section');
    section.appendChild(location);
    section.appendChild(temperature);
    section.appendChild(condition);
    section.appendChild(hourBtns);
}
welcomePage();

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
    const hourBtns = document.createElement('div');
    hourBtns.classList.add("d-flex");

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
        hourBtns.appendChild(btn);
    })
    section.appendChild(hourBtns);
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
