const apiKey = "f413a804591d4ca28ef111654242806";
const comboBox = document.querySelector('#cities');

const cities = ["Bangkok", "Yangon", "Mandalay", "Magway", "Chiang Mai"];

function showCities() {
    cities.map(city => {
        const cityName = city;
        const option = document.createElement('option');
        option.value = cityName;
        option.textContent = cityName;
        comboBox.appendChild(option);
    })
}
showCities();

async function showData() {
    const selected_city = comboBox.value;
    const data = await fetchData(selected_city, "forecast.json");
    console.log(data);
    const condition = document.createElement('h3');
    condition.classList.add("condition-css");
    condition.classList.add("display-5");
    condition.textContent = data.current.condition.text
    const section = document.querySelector('#weather-section');


    //remove previous image inserted in the modal before inserting another
    while (section.firstChild) { //till there is a child
        section.removeChild(section.firstChild); //remove that child
    }
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