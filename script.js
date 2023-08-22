"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const cityWeather = document.querySelector(".weather-app__city");
const temperature = document.querySelector(".weather-app__weather-temp");
const cityInput = document.querySelector(".weather-app__input");
const searchButton = document.querySelector(".weather-app__button");
const day = document.querySelector(".weather-app__day");
const currentDate = document.querySelector(".weather-app__current-date");
const weatherDescription = document.querySelector(".weather-app__weather-description");
const humidity = document.querySelector(".weather-app__weather-humidity");
const wind = document.querySelector(".weather-app__weather-wind");
const otherDayInformation = document.querySelector(".weather-app__other-days-information");
const weatherInformation = document.querySelector(".weather-app__information");
const icon = document.querySelector(".bi");
const weatherIcons = {
    "01d": "bi-brightness-high-fill",
    "02d": "bi-cloud-sun",
    "03d": "bi-cloud-sun",
    "04d": "bi-cloud-sun",
    "09d": "bi-cloud-drizzle",
    "10d": "bi-cloud-drizzle",
    "11d": "bi-cloud-lightning",
};
function findWeather() {
    return __awaiter(this, void 0, void 0, function* () {
        const cityInputName = cityInput === null || cityInput === void 0 ? void 0 : cityInput.value;
        const weather = yield myFetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityInputName}&appid=4b03bf5685cfcf66d0f3b02c6ca29074&units=metric&cnt=2`);
        console.log(weather);
        if (weather.cod === "404" || cityInputName === "") {
            return;
        }
        weatherInformation === null || weatherInformation === void 0 ? void 0 : weatherInformation.classList.remove("weather-app__information--none");
        if (cityWeather) {
            cityWeather.innerText = `${weather.city.name}, ${weather.city.country}`;
        }
        icon === null || icon === void 0 ? void 0 : icon.classList.forEach((x) => {
            if (x !== "bi") {
                icon.classList.remove(x);
            }
        });
        const iconFromApi = weather.list[0].weather[0].icon;
        icon === null || icon === void 0 ? void 0 : icon.classList.add(weatherIcons[iconFromApi]);
        if (temperature) {
            temperature.innerText = `${Math.round(weather.list[0].main.temp)}°C`;
        }
        const cityDate = new Date(weather.list[0].dt * 1000);
        const [weekDayName, actualDate] = new Intl.DateTimeFormat("pl", {
            dateStyle: "full",
        })
            .format(cityDate)
            .split(", ");
        if (day && currentDate && humidity && wind) {
            day.innerText = weekDayName;
            currentDate.innerText = actualDate;
            humidity.innerText = `${Math.round(weather.list[0].main.humidity)}%`;
            wind.innerText = `${Math.round(weather.list[0].wind.speed) * 3.6}km/h`;
        }
        weather.list.forEach((element) => {
            const nextCityDate = new Date(element.dt * 1000);
            const wrapperElement = document.createElement("div");
            wrapperElement.classList.add("weather-app__other-days-information__box");
            otherDayInformation === null || otherDayInformation === void 0 ? void 0 : otherDayInformation.appendChild(wrapperElement);
            const paragraf = document.createElement("p");
            const h4 = document.createElement("h3");
            paragraf.innerText = new Intl.DateTimeFormat("pl", {
                weekday: "short",
            }).format(nextCityDate);
            h4.innerText = `${Math.round(element.main.temp)}°C`;
            wrapperElement.appendChild(paragraf);
            wrapperElement.appendChild(h4);
        });
        const weatherDescriptionTranslate = weather.list[0].weather[0].description;
        const translatedValue = yield myFetch(`https://api.mymemory.translated.net/get?q=${weatherDescriptionTranslate}&langpair=en|pl`);
        if (weatherDescription) {
            weatherDescription.innerText = translatedValue.responseData.translatedText;
        }
    });
}
searchButton === null || searchButton === void 0 ? void 0 : searchButton.addEventListener("click", findWeather);
cityInput === null || cityInput === void 0 ? void 0 : cityInput.addEventListener("keyup", (event) => {
    console.log("test");
    if (event.code === "Enter") {
        findWeather();
    }
});
function myFetch(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        return response.json();
    });
}
