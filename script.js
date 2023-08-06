const cityWeather = document.querySelector(".card__city");
const temperature = document.querySelector(".card__temp");
const cityInput = document.querySelector(".city__input");
const searchButton = document.querySelector(".search__button");
const day = document.querySelector(".card__day");
const currentDate = document.querySelector(".card__date");
const weatherDescription = document.querySelector(".card__description");
const precipitation = document.querySelector(".weatherValues__precipitation");
const humidity = document.querySelector(".weatherValues__humidity");
const wind = document.querySelector(".weatherValues__wind");
const otherDayInformation = document.querySelector(".otherDaysInformation");
const weatherInformation = document.querySelector(".weather-information");
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

async function findWeather() {
  const cityInputName = cityInput.value;
  const weather = await myFetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityInputName}&appid=4b03bf5685cfcf66d0f3b02c6ca29074&units=metric&cnt=2`
  );
  console.log(weather);
  if (weather.cod === "404" || cityInputName === "") {
    return;
  }
  weatherInformation.classList.remove("d-none");
  cityWeather.innerText = `${weather.city.name}, ${weather.city.country}`;
  icon.classList.forEach((x) => {
    if (x !== "bi") {
      icon.classList.remove(x);
    }
  });
  icon.classList.add(weatherIcons[weather.list[0].weather[0].icon]);
  temperature.innerText = `${Math.round(weather.list[0].main.temp)}°C`;
  const cityDate = new Date(weather.list[0].dt * 1000);
  const [weekDayName, actualDate] = new Intl.DateTimeFormat("pl", {
    dateStyle: "full",
  })
    .format(cityDate)
    .split(", ");
  day.innerText = weekDayName;
  currentDate.innerText = actualDate;
  humidity.innerText = `${Math.round(weather.list[0].main.humidity)}%`;
  wind.innerText = `${Math.round(weather.list[0].wind.speed) * 3.6}km/h`;

  weather.list.forEach((element) => {
    const nextCityDate = new Date(element.dt * 1000);
    const wrapperElement = document.createElement("div");
    wrapperElement.classList.add("otherDaysInformation__box");
    otherDayInformation.appendChild(wrapperElement);
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
  const translatedValue = await myFetch(
    `https://api.mymemory.translated.net/get?q=${weatherDescriptionTranslate}&langpair=en|pl`
  );
  weatherDescription.innerText = translatedValue.responseData.translatedText;
}

searchButton.addEventListener("click", findWeather);
cityInput.addEventListener("keyup", (event) => {
  if (event.code === "Enter") {
    findWeather();
  }
});

async function myFetch(url) {
  const response = await fetch(url);
  return response.json();
}
