//dotenv
async function getApiKey() {
    const res = await fetch("https://weather-check-i9wh.onrender.com/api-key");
    const data = await res.json();
    return data.apiKey;
}

//variaveis 

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityInfo = document.querySelector("#city");
const tempElement = document.querySelector("#temperatura span");
const descElement = document.querySelector("#descrition");
const weatherIcon = document.querySelector("#weather");
const contryElement = document.querySelector("#country");
const umidityElement = document.querySelector("#umidade span");
const windElement = document.querySelector("#wind span");

const weatherCotainer = document.querySelector(".hide")

//funcao

//pegar as coordenadas do local para obter a bandeira do pais
const getCoordinates = async(lat, lon) => {
    const apiURL = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

     const res = await fetch(apiURL);
     const Countrydata = await res.json(); 
     
    if (Countrydata.address && Countrydata.address.country_code) {
        return Countrydata.address.country_code;
    } else {
        return "pais nao encontrado!";
    }

}

const weatherData = async(city) => {
    const apiKey = await getApiKey();
    const apiWeatherURL = `https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${apiKey}`;
    try {
    const res = await fetch(apiWeatherURL);
    const data = await res.json();

    console.log(data);
    return data;
    } catch (error) {
        console.log("Erro ao buscar os dados!", error);
        return null;
    }
}

//const country = await getCoordinates(latitude, longitude); 
//console.log(country)


const showWeatherData = async (city) => {
    const data = await weatherData(city);
    
    if (!data || !data.data || !data.data.values){
        console.error("erro dados invalidos.");
        return;
    }

    const location = data.location;
    const clima = data.data.values;

    const lat = location.lat;
    const lon = location.lon;

    const country = await getCoordinates(lat, lon);
    console.log(country)

    cityInfo.innerHTML = city;
    tempElement.innerHTML = parseInt(clima.temperature);
    umidityElement.innerHTML = `${clima.humidity} %`;
    windElement.innerHTML = `${clima.windSpeed} km/h`;
    descElement.innerHTML = `${interpretarCode(clima.weatherCode)}`;
    contryElement.src = `https://flagcdn.com/w40/${country}.png`

    weatherCotainer.classList.remove("hide");
}

function interpretarCode(weatherCode){
    const codigos = {
            0: "Desconhecido",
            1000: "Céu limpo, ensolarado ☀️",
            1100: "Parcialmente limpo 🌤️",
            1101: "Parcialmente nublado 🌤️",
            1102: "Muito nublado ⛅",
            1001: "Nublado ☁️",
            2000: "Nevoeiro 🌫️",
            2100: "Nevoeiro leve 🌫️",
            4000: "Garoa 🌧️",
            4001: "Chuva 🌧️",
            4200: "Chuva leve 🌦️",
            4201: "Chuva forte 🌧️",
            5000: "Neve ❄️",
            5001: "Flocos de neve ❄️",
            5100: "Neve leve ❄️",
            5101: "Neve intensa ❄️",
            6000: "Garoa congelante ❄️",
            6001: "Chuva congelante 🌧️❄️",
            6200: "Chuva congelante leve 🌧️❄️",
            6201: "Chuva congelante intensa 🌧️❄️",
            7000: "Granizo 🌧️🧊",
            7101: "Granizo intenso 🌧️🧊",
            7102: "Granizo leve 🌧️🧊",
            8000: "Tempestade ⛈️"       
    }
    return codigos[weatherCode] || "codigo nao encontrado";
}

//eventos

searchBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    const city = cityInput.value;
    showWeatherData(city);
});
